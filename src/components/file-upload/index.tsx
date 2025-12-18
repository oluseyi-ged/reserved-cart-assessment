import {Text} from '@components/text';
import {RS} from '@helpers';
import {pick, types} from '@react-native-documents/picker';
import {palette} from '@theme';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Block} from '../block';
import {SvgIcon} from '../svg-icon';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const UploadStatus = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

type UploadStatusType = (typeof UploadStatus)[keyof typeof UploadStatus];

export type FileType = {
  name: string;
  uri: string;
  type: string;
  size: number;
} | null;

export function useFileUpload(initialFiles: FileType[] = []) {
  const [files, setFiles] = useState<FileType[]>(initialFiles);
  const [status, setStatus] = useState<UploadStatusType>(
    initialFiles.length > 0 ? UploadStatus.SUCCESS : UploadStatus.IDLE,
  );
  const [error, setError] = useState<string | null>(null);

  const pickFile = async (allowMultiple: boolean = false) => {
    try {
      setStatus(UploadStatus.UPLOADING);
      const result = await pick({
        type: [types.pdf, types.images],
        allowMultiSelection: allowMultiple,
      });
      //@ts-ignore
      setFiles(prevFiles => [...prevFiles, ...result]);
      setStatus(UploadStatus.SUCCESS);
      setError(null);
    } catch (err: any) {
      if (
        err?.message === 'User canceled document picker' ||
        err?.code === 'DOCUMENT_PICKER_CANCELED'
      ) {
        setStatus(UploadStatus.IDLE);
      } else {
        console.error('File picker error:', err);
        setError('File selection failed');
        setStatus(UploadStatus.ERROR);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        setStatus(UploadStatus.IDLE);
      }
      return newFiles;
    });
    setError(null);
  };

  return {files, status, error, pickFile, removeFile, setFiles, setStatus};
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Status configuration for document statuses
const STATUS_CONFIG: Record<
  string,
  {label: string; color: string; icon: string}
> = {
  PENDING_REVIEW: {label: 'Pending', color: '#FA870B', icon: 'pending-review'},
  APPROVED: {label: 'Approved', color: palette.green, icon: 'verify'},
  REJECTED: {label: 'Rejected', color: '#FB2B3A', icon: 'alert'},
  EXPIRED: {label: 'Expired', color: '#EF4444', icon: 'alert'},
};

export function FileUploadComponent({
  title,
  onFileSelected,
  onPress,
  allowMultiple = false,
  initialFiles = [],
  maxUploads = 10,
  showOptions = false,
  uploading = false,
  uploaded = false,
  fileDetail,
  onDeleteFile,
  preview = false,
  documentStatus,
}: {
  title: string;
  onFileSelected?: (files: FileType[]) => void;
  onPress?: () => void;
  allowMultiple?: boolean;
  initialFiles?: FileType[];
  maxUploads?: number;
  showOptions?: boolean;
  uploading?: boolean;
  uploaded?: boolean;
  fileDetail?: any;
  onDeleteFile?: () => void;
  preview?: boolean;
  documentStatus?: string;
}) {
  const {files, status, pickFile, setFiles, setStatus} =
    useFileUpload(initialFiles);
  const [showImagePreview, setShowImagePreview] = useState(false);

  useEffect(() => {
    onFileSelected?.(files);
  }, [files, onFileSelected]);

  useEffect(() => {
    if (
      initialFiles.length !== files.length ||
      !initialFiles.every((file, i) => file?.uri === files[i]?.uri)
    ) {
      setFiles(initialFiles);
      setStatus(
        initialFiles.length > 0 ? UploadStatus.SUCCESS : UploadStatus.IDLE,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFiles, setFiles, setStatus]);

  const handlePress = () => {
    if (preview && onPress) {
      onPress();
    } else if (showOptions && onPress) {
      onPress();
    } else if (!preview) {
      pickFile(allowMultiple);
    }
  };

  const getDisplayText = () => {
    if (uploading) return 'Uploading...';
    if (uploaded) return 'Uploaded';
    if (preview && fileDetail?.name) return fileDetail.name;
    if (status === UploadStatus.SUCCESS && files.length > 0) {
      return files[files.length - 1]?.name || 'Upload';
    }
    return 'Upload';
  };

  const getIconName = () => {
    if (uploading) return 'upload';
    if (preview) return 'caret-right';
    if (uploaded) return 'check-circle';
    return 'upload';
  };

  const getIconColor = () => {
    if (uploaded) return palette.green;
    if (preview) return palette.grayFade;
    return palette.codGray;
  };

  const isImage = (type: string) => {
    return type?.startsWith('image/');
  };

  const hasFile = preview
    ? !!(fileDetail && fileDetail.uri)
    : !!fileDetail?.uri;

  return (
    <>
      <Block
        onPress={hasFile || !preview ? handlePress : undefined}
        radius={12}
        justify="space-between"
        row
        style={styles.uploadBlock}>
        <Block row alignItems="center" gap={8} flex={1}>
          {hasFile && fileDetail?.uri && isImage(fileDetail.type) ? (
            <TouchableOpacity
              style={{
                backgroundColor: '#EFEFEF',
                borderRadius: RS(8),
              }}
              onPress={() => setShowImagePreview(true)}>
              <Image
                source={{uri: fileDetail.uri}}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : hasFile && fileDetail?.uri ? (
            <Block style={styles.fileIcon} align="center" justify="center">
              <SvgIcon name="file-add" size={24} color={palette.cornFlower} />
            </Block>
          ) : (
            <SvgIcon name="file-add" size={48} />
          )}

          <Block justify="space-between" flex={1}>
            <Text color={palette.shaft3} medium numberOfLines={1}>
              {title}
            </Text>
            <Block gap={8} row align="center" wrap="wrap">
              {hasFile && fileDetail?.size && (
                <>
                  <Text color="#707071" size={12}>
                    {formatFileSize(fileDetail.size)}
                  </Text>
                </>
              )}
              {hasFile && fileDetail && (
                <>
                  {fileDetail?.size && (
                    <Text color="#707071" size={12}>
                      •
                    </Text>
                  )}
                  <Block row gap={5} align="center">
                    {documentStatus && STATUS_CONFIG[documentStatus] ? (
                      <>
                        <SvgIcon
                          name={STATUS_CONFIG[documentStatus].icon}
                          size={11}
                          color={STATUS_CONFIG[documentStatus].color}
                        />
                        <Text
                          size={12}
                          color={STATUS_CONFIG[documentStatus].color}>
                          {STATUS_CONFIG[documentStatus].label}
                        </Text>
                      </>
                    ) : (
                      <>
                        <SvgIcon name="verify" size={11} />
                        <Text size={12} color={palette.green}>
                          Completed
                        </Text>
                      </>
                    )}
                  </Block>
                </>
              )}
              {!hasFile && (
                <Text color={uploaded ? palette.green : '#707071'} size={12}>
                  {getDisplayText()}
                </Text>
              )}
            </Block>
          </Block>
        </Block>

        {preview ? (
          <SvgIcon name="caret-right" size={24} color={palette.grayFade} />
        ) : hasFile && onDeleteFile ? (
          <SvgIcon
            name="bin"
            size={20}
            color={palette.red || '#FF0000'}
            onPress={onDeleteFile}
          />
        ) : uploading ? (
          <ActivityIndicator size="small" color={palette.madison} />
        ) : (
          <SvgIcon name={getIconName()} size={20} color={getIconColor()} />
        )}
      </Block>

      {/* Image Preview Modal */}
      <Modal
        visible={showImagePreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}>
        <Block style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowImagePreview(false)}>
            <Block style={styles.modalContent}>
              <Block style={styles.imageHeader}>
                <Text color={palette.white} size={16} medium>
                  {fileDetail?.name || 'Image Preview'}
                </Text>
                <TouchableOpacity onPress={() => setShowImagePreview(false)}>
                  <SvgIcon name="close" size={34} color={palette.white} />
                </TouchableOpacity>
              </Block>
              <Image
                source={{uri: fileDetail?.uri}}
                style={styles.previewImage}
                resizeMode="contain"
              />
            </Block>
          </TouchableOpacity>
        </Block>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  uploadBlock: {
    borderWidth: 1,
    borderColor: '#2632381A',
    padding: 8,
    marginTop: 20,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0EFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  previewImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
});
