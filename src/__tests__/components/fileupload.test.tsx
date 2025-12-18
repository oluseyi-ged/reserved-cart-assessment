import DocumentPicker from '@react-native-documents/picker';
import {act, renderHook} from '@testing-library/react-hooks';
import {fireEvent, waitFor} from '@testing-library/react-native';
import {renderWithProviders} from '@utils/test-utils';
import React from 'react';
import {FileUploadComponent, useFileUpload} from '../../components/file-upload';

// Mock DocumentPicker
jest.mock('@react-native-documents/picker', () => ({
  __esModule: true,
  default: {
    pick: jest.fn(),
    isCancel: jest.fn(),
    types: {
      pdf: 'application/pdf',
      images: 'image/*',
    },
  },
}));

// Mock components
jest.mock('@components/text', () => ({
  Text: ({children, testID, ...props}: any) => {
    const {Text: RNText} = require('react-native');
    return (
      <RNText testID={testID} {...props}>
        {children}
      </RNText>
    );
  },
}));

jest.mock('../../components/block', () => ({
  Block: ({children, testID, onPress, ...props}: any) => {
    const {View, TouchableOpacity} = require('react-native');
    if (onPress) {
      return (
        <TouchableOpacity testID={testID} onPress={onPress} {...props}>
          {children}
        </TouchableOpacity>
      );
    }
    return (
      <View testID={testID} {...props}>
        {children}
      </View>
    );
  },
}));

jest.mock('../../components/svg-icon', () => ({
  SvgIcon: ({name, testID}: any) => {
    const {View, Text} = require('react-native');
    return (
      <View testID={testID || `svg-icon-${name}`}>
        <Text>{name}</Text>
      </View>
    );
  },
}));

// Mock theme
jest.mock('@theme', () => ({
  palette: {
    shaft3: '#333333',
    codGray: '#666666',
  },
}));

describe('useFileUpload Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty files and idle status', () => {
      const {result} = renderHook(() => useFileUpload());

      expect(result.current.files).toEqual([]);
      expect(result.current.status).toBe('idle');
      expect(result.current.error).toBeNull();
    });

    it('should initialize with initial files and success status', () => {
      const initialFiles = [
        {
          name: 'test.pdf',
          uri: 'file://test.pdf',
          type: 'application/pdf',
          size: 1024,
        },
      ];

      const {result} = renderHook(() => useFileUpload(initialFiles));

      expect(result.current.files).toEqual(initialFiles);
      expect(result.current.status).toBe('success');
    });
  });

  describe('pickFile', () => {
    it('should pick a file successfully', async () => {
      const mockFile = {
        name: 'document.pdf',
        uri: 'file://document.pdf',
        type: 'application/pdf',
        size: 2048,
      };

      (DocumentPicker.pick as jest.Mock).mockResolvedValueOnce([mockFile]);

      const {result} = renderHook(() => useFileUpload());

      await act(async () => {
        await result.current.pickFile(false);
      });

      expect(result.current.files).toContainEqual(mockFile);
      expect(result.current.status).toBe('success');
      expect(result.current.error).toBeNull();
    });

    it('should pick multiple files when allowMultiple is true', async () => {
      const mockFiles = [
        {
          name: 'doc1.pdf',
          uri: 'file://doc1.pdf',
          type: 'application/pdf',
          size: 1024,
        },
        {
          name: 'doc2.pdf',
          uri: 'file://doc2.pdf',
          type: 'application/pdf',
          size: 2048,
        },
      ];

      (DocumentPicker.pick as jest.Mock).mockResolvedValueOnce(mockFiles);

      const {result} = renderHook(() => useFileUpload());

      await act(async () => {
        await result.current.pickFile(true);
      });

      expect(result.current.files).toHaveLength(2);
      expect(result.current.status).toBe('success');
    });

    it('should append files to existing files', async () => {
      const initialFile = {
        name: 'existing.pdf',
        uri: 'file://existing.pdf',
        type: 'application/pdf',
        size: 1024,
      };

      const newFile = {
        name: 'new.pdf',
        uri: 'file://new.pdf',
        type: 'application/pdf',
        size: 2048,
      };

      (DocumentPicker.pick as jest.Mock).mockResolvedValueOnce([newFile]);

      const {result} = renderHook(() => useFileUpload([initialFile]));

      await act(async () => {
        await result.current.pickFile(false);
      });

      expect(result.current.files).toHaveLength(2);
      expect(result.current.files).toContainEqual(initialFile);
      expect(result.current.files).toContainEqual(newFile);
    });

    it('should set status to uploading while picking', async () => {
      const mockFile = {
        name: 'test.pdf',
        uri: 'file://test.pdf',
        type: 'application/pdf',
        size: 1024,
      };

      let resolvePickFile: any;
      (DocumentPicker.pick as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => (resolvePickFile = resolve)),
      );

      const {result} = renderHook(() => useFileUpload());

      act(() => {
        result.current.pickFile(false);
      });

      expect(result.current.status).toBe('uploading');

      await act(async () => {
        resolvePickFile([mockFile]);
      });

      expect(result.current.status).toBe('success');
    });

    it('should handle cancel by user', async () => {
      const cancelError = new Error('User cancelled');
      (DocumentPicker.isCancel as jest.Mock).mockReturnValueOnce(true);
      (DocumentPicker.pick as jest.Mock).mockRejectedValueOnce(cancelError);

      const {result} = renderHook(() => useFileUpload());

      await act(async () => {
        await result.current.pickFile(false);
      });

      expect(result.current.files).toEqual([]);
      expect(result.current.status).toBe('idle');
      expect(result.current.error).toBeNull();
    });

    it('should handle file selection error', async () => {
      (DocumentPicker.isCancel as jest.Mock).mockReturnValueOnce(false);
      (DocumentPicker.pick as jest.Mock).mockRejectedValueOnce(
        new Error('Failed'),
      );

      const {result} = renderHook(() => useFileUpload());

      await act(async () => {
        await result.current.pickFile(false);
      });

      expect(result.current.files).toEqual([]);
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('File selection failed');
    });
  });

  describe('removeFile', () => {
    it('should remove a file by index', () => {
      const initialFiles = [
        {
          name: 'file1.pdf',
          uri: 'file://file1.pdf',
          type: 'application/pdf',
          size: 1024,
        },
        {
          name: 'file2.pdf',
          uri: 'file://file2.pdf',
          type: 'application/pdf',
          size: 2048,
        },
      ];

      const {result} = renderHook(() => useFileUpload(initialFiles));

      act(() => {
        result.current.removeFile(0);
      });

      expect(result.current.files).toHaveLength(1);
      expect(result.current.files[0].name).toBe('file2.pdf');
    });

    it('should set status to idle when all files are removed', () => {
      const initialFiles = [
        {
          name: 'file1.pdf',
          uri: 'file://file1.pdf',
          type: 'application/pdf',
          size: 1024,
        },
      ];

      const {result} = renderHook(() => useFileUpload(initialFiles));

      act(() => {
        result.current.removeFile(0);
      });

      expect(result.current.files).toEqual([]);
      expect(result.current.status).toBe('idle');
    });

    it('should clear error when removing a file', () => {
      const initialFiles = [
        {
          name: 'file1.pdf',
          uri: 'file://file1.pdf',
          type: 'application/pdf',
          size: 1024,
        },
      ];

      const {result} = renderHook(() => useFileUpload(initialFiles));

      // Manually set error
      act(() => {
        (DocumentPicker.isCancel as jest.Mock).mockReturnValueOnce(false);
        (DocumentPicker.pick as jest.Mock).mockRejectedValueOnce(
          new Error('Failed'),
        );
        result.current.pickFile(false);
      });

      act(() => {
        result.current.removeFile(0);
      });

      expect(result.current.error).toBeNull();
    });

    it('should maintain status as success when removing one of multiple files', () => {
      const initialFiles = [
        {
          name: 'file1.pdf',
          uri: 'file://file1.pdf',
          type: 'application/pdf',
          size: 1024,
        },
        {
          name: 'file2.pdf',
          uri: 'file://file2.pdf',
          type: 'application/pdf',
          size: 2048,
        },
      ];

      const {result} = renderHook(() => useFileUpload(initialFiles));

      act(() => {
        result.current.removeFile(0);
      });

      expect(result.current.files).toHaveLength(1);
      expect(result.current.status).toBe('success');
    });
  });
});

describe('FileUploadComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with title', () => {
      const {getByText} = renderWithProviders(
        <FileUploadComponent title="Upload Document" />,
      );

      expect(getByText('Upload Document')).toBeTruthy();
      expect(getByText('Upload')).toBeTruthy();
    });

    it('should render file icons', () => {
      const {getByTestId} = renderWithProviders(
        <FileUploadComponent title="Upload Document" />,
      );

      expect(getByTestId('svg-icon-file-add')).toBeTruthy();
      expect(getByTestId('svg-icon-upload')).toBeTruthy();
    });
  });

  describe('File Selection', () => {
    it('should open file picker when pressed', async () => {
      (DocumentPicker.pick as jest.Mock).mockResolvedValueOnce([]);

      const {getByTestId} = renderWithProviders(
        <FileUploadComponent title="Upload Document" />,
      );

      const uploadBlock = getByTestId('svg-icon-file-add').parent?.parent;

      fireEvent.press(uploadBlock!);

      await waitFor(() => {
        expect(DocumentPicker.pick).toHaveBeenCalledWith({
          type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
          allowMultiSelection: false,
        });
      });
    });

    it('should allow multiple selection when allowMultiple is true', async () => {
      (DocumentPicker.pick as jest.Mock).mockResolvedValueOnce([]);

      const {getByTestId} = renderWithProviders(
        <FileUploadComponent title="Upload Document" allowMultiple />,
      );

      const uploadBlock = getByTestId('svg-icon-file-add').parent?.parent;

      fireEvent.press(uploadBlock!);

      await waitFor(() => {
        expect(DocumentPicker.pick).toHaveBeenCalledWith({
          type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
          allowMultiSelection: true,
        });
      });
    });

    it('should call onFileSelected callback when file is selected', async () => {
      const mockFile = {
        name: 'test.pdf',
        uri: 'file://test.pdf',
        type: 'application/pdf',
        size: 1024,
      };

      const mockOnFileSelected = jest.fn();
      (DocumentPicker.pick as jest.Mock).mockResolvedValueOnce([mockFile]);

      const {getByTestId} = renderWithProviders(
        <FileUploadComponent
          title="Upload Files"
          onFileSelected={mockOnFileSelected}
        />,
      );

      const uploadBlock = getByTestId('svg-icon-file-add').parent?.parent;

      fireEvent.press(uploadBlock!);

      await waitFor(() => {
        expect(mockOnFileSelected).toHaveBeenCalledWith([mockFile]);
      });
    });

    it('should not call onFileSelected when not provided', async () => {
      const mockFile = {
        name: 'test.pdf',
        uri: 'file://test.pdf',
        type: 'application/pdf',
        size: 1024,
      };

      (DocumentPicker.pick as jest.Mock).mockResolvedValueOnce([mockFile]);

      const {getByTestId} = renderWithProviders(
        <FileUploadComponent title="Upload Files" />,
      );

      const uploadBlock = getByTestId('svg-icon-file-add').parent?.parent;

      expect(() => fireEvent.press(uploadBlock!)).not.toThrow();
    });
  });

  describe('Initial Files', () => {
    it('should render with initial files', () => {
      const initialFiles = [
        {
          name: 'initial.pdf',
          uri: 'file://initial.pdf',
          type: 'application/pdf',
          size: 1024,
        },
      ];

      const {getByText} = renderWithProviders(
        <FileUploadComponent
          title="Upload Files"
          initialFiles={initialFiles}
        />,
      );

      expect(getByText('initial.pdf')).toBeTruthy();
    });

    it('should update when initialFiles prop changes', () => {
      const initialFiles1 = [
        {
          name: 'file1.pdf',
          uri: 'file://file1.pdf',
          type: 'application/pdf',
          size: 1024,
        },
      ];

      const initialFiles2 = [
        {
          name: 'file2.pdf',
          uri: 'file://file2.pdf',
          type: 'application/pdf',
          size: 2048,
        },
      ];

      const {getByText, rerender} = renderWithProviders(
        <FileUploadComponent
          title="Upload Files"
          initialFiles={initialFiles1}
        />,
      );

      expect(getByText('file1.pdf')).toBeTruthy();

      rerender(
        <FileUploadComponent
          title="Upload Files"
          initialFiles={initialFiles2}
        />,
      );

      expect(getByText('file2.pdf')).toBeTruthy();
    });

    it('should reset to Upload text when initialFiles becomes empty', () => {
      const initialFiles = [
        {
          name: 'file1.pdf',
          uri: 'file://file1.pdf',
          type: 'application/pdf',
          size: 1024,
        },
      ];

      const {getAllByText, queryByText, rerender} = renderWithProviders(
        <FileUploadComponent
          title="Upload Files"
          initialFiles={initialFiles}
        />,
      );

      expect(queryByText('file1.pdf')).toBeTruthy();

      rerender(<FileUploadComponent title="Upload Files" initialFiles={[]} />);

      expect(getAllByText('Upload').length).toBeGreaterThan(0);
      expect(queryByText('file1.pdf')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle user cancellation gracefully', async () => {
      const cancelError = new Error('User cancelled');
      (DocumentPicker.isCancel as jest.Mock).mockReturnValueOnce(true);
      (DocumentPicker.pick as jest.Mock).mockRejectedValueOnce(cancelError);

      const {getByTestId, getAllByText} = renderWithProviders(
        <FileUploadComponent title="Upload Files" />,
      );

      const uploadBlock = getByTestId('svg-icon-file-add').parent?.parent;

      fireEvent.press(uploadBlock!);

      await waitFor(() => {
        expect(getAllByText('Upload').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle maxUploads prop', () => {
      const {getAllByText} = renderWithProviders(
        <FileUploadComponent title="Upload Files" maxUploads={5} />,
      );

      expect(getAllByText('Upload').length).toBeGreaterThan(0);
    });

    it('should handle file with null values', () => {
      const filesWithNull = [
        null,
        {
          name: 'valid.pdf',
          uri: 'file://valid.pdf',
          type: 'application/pdf',
          size: 1024,
        },
      ];

      const {getByText} = renderWithProviders(
        <FileUploadComponent
          title="Upload Files"
          initialFiles={filesWithNull as any}
        />,
      );

      expect(getByText('valid.pdf')).toBeTruthy();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - idle state', () => {
      const {toJSON} = renderWithProviders(
        <FileUploadComponent title="Upload Document" />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with file selected', () => {
      const initialFiles = [
        {
          name: 'document.pdf',
          uri: 'file://document.pdf',
          type: 'application/pdf',
          size: 1024,
        },
      ];

      const {toJSON} = renderWithProviders(
        <FileUploadComponent
          title="Upload Document"
          initialFiles={initialFiles}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
