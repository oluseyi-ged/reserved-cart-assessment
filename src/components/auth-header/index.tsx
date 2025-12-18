import {Block, SvgIcon, Text} from '@components';
import {RS} from '@helpers';
import {useNavigation} from '@react-navigation/native';
import {palette} from '@theme';
import React, {FC, ReactNode} from 'react';
import {StyleSheet} from 'react-native';

interface AuthHeaderProps {
  back?: boolean;
  title?: string;
  headerLeftElement?: ReactNode;
  headerRightElement?: ReactNode;
  onBackPress?: () => void;
  hideLogo?: boolean;
}

const AuthHeader: FC<AuthHeaderProps> = ({
  back,
  title,
  headerLeftElement,
  headerRightElement,
  onBackPress,
  hideLogo = false,
}) => {
  const navigation = useNavigation();

  return (
    <Block row align="center" justify="space-between">
      <Block row gap={20} align="center">
        {back ? (
          <SvgIcon
            name="arrow-back"
            size={22}
            color={palette.black}
            onPress={() => {
              if (onBackPress) {
                onBackPress();
              } else {
                navigation.goBack();
              }
            }}
          />
        ) : headerLeftElement ? (
          headerLeftElement
        ) : null}
        {title ? (
          <Text size={20} medium>
            {title}
          </Text>
        ) : hideLogo ? null : (
          <SvgIcon name="app-icon" size={41} />
        )}
      </Block>

      {headerRightElement ? (
        headerRightElement
      ) : (
        <Block style={styles.helpBox} radius={1000}>
          <Text size={14}>Need help?</Text>
        </Block>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  helpBox: {
    borderWidth: 1,
    borderColor: palette.border,
    padding: RS(10),
  },
});

export default AuthHeader;
