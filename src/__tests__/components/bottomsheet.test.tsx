import {render, waitFor} from '@testing-library/react-native';
import React, {createRef} from 'react';
import {Keyboard, Text} from 'react-native';
import {
  BottomSheet,
  BottomSheetModalRefProps,
} from '../../components/bottom-sheet';

// Mock Keyboard
jest.spyOn(Keyboard, 'dismiss');

// Mock @gorhom/bottom-sheet
const mockPresent = jest.fn();
const mockDismiss = jest.fn();

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    __esModule: true,
    BottomSheetModal: React.forwardRef(
      ({children, onChange, snapPoints, ...props}: any, ref: any) => {
        React.useImperativeHandle(ref, () => ({
          present: mockPresent,
          dismiss: mockDismiss,
          snapToIndex: jest.fn(),
          snapToPosition: jest.fn(),
          expand: jest.fn(),
          collapse: jest.fn(),
          close: jest.fn(),
        }));

        return (
          <View testID="bottom-sheet-modal" {...props}>
            {children}
          </View>
        );
      },
    ),
    BottomSheetModalProvider: ({children}: any) => {
      return <View testID="bottom-sheet-provider">{children}</View>;
    },
    BottomSheetBackdrop: ({pressBehavior, ...props}: any) => {
      const {TouchableOpacity, View} = require('react-native');
      return (
        <TouchableOpacity testID="bottom-sheet-backdrop" {...props}>
          <View />
        </TouchableOpacity>
      );
    },
  };
});

// Mock theme
jest.mock('@theme', () => ({
  palette: {
    black: '#000000',
    white: '#FFFFFF',
    primary: '#007AFF',
  },
}));

describe('BottomSheet Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render children', () => {
      const {getByText} = render(
        <BottomSheet>
          <Text>Bottom Sheet Content</Text>
        </BottomSheet>,
      );

      expect(getByText('Bottom Sheet Content')).toBeTruthy();
    });

    it('should render BottomSheetModal', () => {
      const {getByTestId} = render(
        <BottomSheet>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
    });

    it('should render BottomSheetModalProvider', () => {
      const {getByTestId} = render(
        <BottomSheet>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('bottom-sheet-provider')).toBeTruthy();
    });
  });

  describe('Ref Methods', () => {
    it('should expose presentBottomSheet method via ref', () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(ref.current).toBeDefined();
      expect(ref.current?.presentBottomSheet).toBeDefined();
      expect(typeof ref.current?.presentBottomSheet).toBe('function');
    });

    it('should expose dismissBottomSheet method via ref', () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(ref.current?.dismissBottomSheet).toBeDefined();
      expect(typeof ref.current?.dismissBottomSheet).toBe('function');
    });

    it('should call present when presentBottomSheet is invoked', async () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      ref.current?.presentBottomSheet();

      await waitFor(() => {
        expect(mockPresent).toHaveBeenCalledTimes(1);
      });
    });

    it('should dismiss keyboard when presentBottomSheet is called', () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      ref.current?.presentBottomSheet();

      expect(Keyboard.dismiss).toHaveBeenCalled();
    });

    it('should call dismiss when dismissBottomSheet is invoked', async () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      ref.current?.dismissBottomSheet();

      await waitFor(() => {
        expect(mockDismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Props', () => {
    it('should use default snapPoints when not provided', () => {
      const {getByTestId} = render(
        <BottomSheet>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
    });

    it('should accept custom snapPoints', () => {
      const customSnapPoints = ['25%', '50%', '90%'];

      const {getByTestId} = render(
        <BottomSheet snapPoints={customSnapPoints}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
    });

    it('should accept numeric snapPoints', () => {
      const numericSnapPoints = [100, 300, 500];

      const {getByTestId} = render(
        <BottomSheet snapPoints={numericSnapPoints}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
    });

    it('should accept handleStyle prop', () => {
      const handleStyle = {backgroundColor: 'red', height: 40};

      const {getByTestId} = render(
        <BottomSheet handleStyle={handleStyle}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
    });

    it('should accept onChange callback', () => {
      const mockOnChange = jest.fn();

      const {getByTestId} = render(
        <BottomSheet onChange={mockOnChange}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
    });

    it('should accept disableSwipeDown prop as false by default', () => {
      const {getByTestId} = render(
        <BottomSheet>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
    });

    it('should accept disableSwipeDown prop as true', () => {
      const {getByTestId} = render(
        <BottomSheet disableSwipeDown={true}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
    });
  });

  describe('Complex Scenarios', () => {
    it('should work with all props together', () => {
      const ref = createRef<BottomSheetModalRefProps>();
      const mockOnChange = jest.fn();
      const handleStyle = {backgroundColor: 'blue'};
      const snapPoints = ['40%', '80%'];

      const {getByText, getByTestId} = render(
        <BottomSheet
          ref={ref}
          snapPoints={snapPoints}
          handleStyle={handleStyle}
          onChange={mockOnChange}
          backdropPressBehavior="collapse"
          disableSwipeDown={true}>
          <Text>Full Props Content</Text>
        </BottomSheet>,
      );

      expect(getByText('Full Props Content')).toBeTruthy();
      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
      expect(ref.current?.presentBottomSheet).toBeDefined();
      expect(ref.current?.dismissBottomSheet).toBeDefined();
    });

    it('should handle multiple present calls', async () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      ref.current?.presentBottomSheet();
      ref.current?.presentBottomSheet();
      ref.current?.presentBottomSheet();

      await waitFor(() => {
        expect(mockPresent).toHaveBeenCalledTimes(3);
      });
    });

    it('should handle multiple dismiss calls', async () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      ref.current?.dismissBottomSheet();
      ref.current?.dismissBottomSheet();

      await waitFor(() => {
        expect(mockDismiss).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle present and dismiss sequence', async () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      ref.current?.presentBottomSheet();
      await waitFor(() => {
        expect(mockPresent).toHaveBeenCalledTimes(1);
      });

      ref.current?.dismissBottomSheet();
      await waitFor(() => {
        expect(mockDismiss).toHaveBeenCalledTimes(1);
      });
    });

    it('should render complex children', () => {
      const {getByText, getByTestId} = render(
        <BottomSheet>
          <Text>Title</Text>
          <Text>Subtitle</Text>
          <Text testID="button">Action Button</Text>
        </BottomSheet>,
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Subtitle')).toBeTruthy();
      expect(getByTestId('button')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle ref being null', () => {
      const {getByText} = render(
        <BottomSheet ref={null}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByText('Content')).toBeTruthy();
    });

    it('should handle empty children', () => {
      const {getByTestId} = render(<BottomSheet>{null}</BottomSheet>);

      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
    });

    it('should have correct displayName', () => {
      expect(BottomSheet.displayName).toBe('BottomSheet');
    });

    it('should handle onChange with all parameters', () => {
      const mockOnChange = jest.fn();

      render(
        <BottomSheet onChange={mockOnChange}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      // The onChange prop is passed to BottomSheetModal
      // In a real scenario, it would be called with (index, position, type)
      expect(mockOnChange).not.toHaveBeenCalled(); // Not called on mount
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - basic', () => {
      const {toJSON} = render(
        <BottomSheet>
          <Text>Basic Content</Text>
        </BottomSheet>,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with custom props', () => {
      const ref = createRef<BottomSheetModalRefProps>();
      const {toJSON} = render(
        <BottomSheet
          ref={ref}
          snapPoints={['50%', '90%']}
          backdropPressBehavior="collapse"
          disableSwipeDown={true}>
          <Text>Custom Props Content</Text>
        </BottomSheet>,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with complex children', () => {
      const {toJSON} = render(
        <BottomSheet>
          <Text>Header</Text>
          <Text>Body</Text>
          <Text>Footer</Text>
        </BottomSheet>,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Integration with Refs', () => {
    it('should allow calling presentBottomSheet immediately after render', () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      // Should not throw
      expect(() => {
        ref.current?.presentBottomSheet();
      }).not.toThrow();
    });

    it('should allow calling dismissBottomSheet immediately after render', () => {
      const ref = createRef<BottomSheetModalRefProps>();

      render(
        <BottomSheet ref={ref}>
          <Text>Content</Text>
        </BottomSheet>,
      );

      // Should not throw
      expect(() => {
        ref.current?.dismissBottomSheet();
      }).not.toThrow();
    });
  });
});
