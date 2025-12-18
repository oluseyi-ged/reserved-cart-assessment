import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetModal as BottomSheetModalType,
} from '@gorhom/bottom-sheet';
import {palette} from '@theme';
import React, {forwardRef, ReactNode, useImperativeHandle, useRef} from 'react';
import {Keyboard, ViewStyle} from 'react-native';
import {SharedValue} from 'react-native-reanimated';

export type SNAP_POINT_TYPE = string | number;

export interface BottomSheetModalRefProps {
  presentBottomSheet: () => void;
  dismissBottomSheet: () => void;
}

export interface BottomSheetModalProps {
  children: ReactNode;
  snapPoints?: Array<string | number> | SharedValue<Array<string | number>>;
  handleStyle?: ViewStyle;
  onChange?: (index: number, position: number, type: SNAP_POINT_TYPE) => void;
  backdropPressBehavior?: 'none' | 'close' | 'collapse' | number;
  disableSwipeDown?: boolean;
  disableBackdrop?: boolean;
  handleComponent?: any;
  topInset?: number;
  bottomInset?: number;
  backgroundComponent?: any;
  backgroundColor?: string;
  detached?: boolean;
  style?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;
  onDismiss?: any;
}

export const BottomSheet = forwardRef<
  BottomSheetModalRefProps,
  BottomSheetModalProps
>(
  (
    {
      children,
      snapPoints = ['100%'],
      handleStyle,
      onChange,
      backdropPressBehavior = 'close',
      disableSwipeDown = false,
      disableBackdrop = false,
      handleComponent,
      topInset,
      bottomInset,
      backgroundComponent,
      backgroundColor = palette.white,
      detached = false,
      style,
      handleIndicatorStyle,
      onDismiss,
    },
    ref,
  ) => {
    const bottomSheetModalRef = useRef<BottomSheetModalType>(null);

    const presentBottomSheet = () => {
      Keyboard.dismiss();
      bottomSheetModalRef.current?.present();
    };

    const dismissBottomSheet = () => {
      bottomSheetModalRef.current?.dismiss();
    };

    useImperativeHandle(ref, () => ({
      presentBottomSheet,
      dismissBottomSheet,
    }));

    const renderBackdrop = (backDropProps: BottomSheetBackdropProps) =>
      disableBackdrop ? null : (
        <BottomSheetBackdrop
          {...backDropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior={backdropPressBehavior}
        />
      );

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          topInset={topInset}
          bottomInset={bottomInset}
          detached={detached}
          style={style}
          ref={bottomSheetModalRef}
          onChange={onChange}
          snapPoints={snapPoints}
          stackBehavior="replace"
          onDismiss={onDismiss}
          enableDismissOnClose
          backgroundComponent={backgroundComponent}
          handleComponent={handleComponent}
          enablePanDownToClose={!disableSwipeDown}
          backdropComponent={disableBackdrop ? undefined : renderBackdrop}
          handleStyle={handleStyle}
          handleIndicatorStyle={[
            {
              backgroundColor: palette.black,
            },
            handleIndicatorStyle,
          ]}
          enableDynamicSizing={false}
          backgroundStyle={{backgroundColor}}>
          {children}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
