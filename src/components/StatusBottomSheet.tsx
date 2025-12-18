import {Success} from '@assets/lottie';
import {Block, BottomSheet, BottomSheetModalRefProps, Button, SvgIcon, Text} from '@components';
import {BottomSheetView} from '@gorhom/bottom-sheet';
import {RH, RS, RW} from '@helpers';
import {palette} from '@theme';
import LottieView from 'lottie-react-native';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';

interface StatusBottomSheetProps {
  status: 'success' | 'error' | null;
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  onSuccessAction?: () => void;
  onErrorAction?: () => void;
  successButtonText?: string;
  errorButtonText?: string;
  showSecondaryButton?: boolean;
  secondaryButtonText?: string;
  onSecondaryAction?: () => void;
}

export interface StatusBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

export const StatusBottomSheet = forwardRef<StatusBottomSheetRef, StatusBottomSheetProps>(
  (
    {
      status,
      successTitle = 'Success!',
      successMessage = 'Operation completed successfully!',
      errorTitle = 'Failed!',
      errorMessage = 'Something went wrong. Please try again.',
      onSuccessAction,
      onErrorAction,
      successButtonText = 'Back to home',
      errorButtonText = 'Try Again',
      showSecondaryButton = false,
      secondaryButtonText = 'Claim Insurance',
      onSecondaryAction,
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheetModalRefProps>(null);
    const animationRef = useRef<LottieView>(null);

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.presentBottomSheet();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismissBottomSheet();
      },
    }));

    return (
      <BottomSheet
        disableSwipeDown={true}
        backdropPressBehavior="none"
        ref={bottomSheetRef}
        snapPoints={[status === 'success' ? '55%' : '50%']}
        topInset={30}>
        <BottomSheetView style={[{paddingVertical: RS(12), paddingHorizontal: RS(29)}]}>
          <Block>
            {status === 'success' ? (
              <>
                <LottieView
                  ref={animationRef}
                  loop
                  hardwareAccelerationAndroid={true}
                  source={Success}
                  style={{
                    alignSelf: 'center',
                    height: RH(70),
                    width: RW(70),
                  }}
                />
                <Text mt={20} center mb={30} size={20} semibold color={palette.madison}>
                  {successTitle}
                </Text>

                <Text color={palette.grayFade} size={16} center mb={30}>
                  {successMessage}
                </Text>

                <Block gap={14}>
                  {showSecondaryButton && onSecondaryAction && (
                    <Button
                      outlined
                      textStyle={{
                        color: palette.cornFlower,
                      }}
                      style={{
                        borderColor: palette.cornFlower,
                      }}
                      title={secondaryButtonText}
                      onPress={onSecondaryAction}
                    />
                  )}
                  <Button title={successButtonText} onPress={onSuccessAction} />
                </Block>
              </>
            ) : (
              <>
                <SvgIcon name="spam" size={72} />
                <Text mt={20} center mb={30} size={20} semibold color={palette.madison}>
                  {errorTitle}
                </Text>

                <Text color={palette.grayFade} size={16} center mb={30}>
                  {errorMessage}
                </Text>

                <Button title={errorButtonText} onPress={onErrorAction} />
              </>
            )}
          </Block>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

StatusBottomSheet.displayName = 'StatusBottomSheet';
