import {Avatar, Block, SizedBox, SvgIcon, Text} from '@components';
import {RH} from '@helpers';
import {palette} from '@theme';
import React, {FC, ReactNode} from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

// Shadow style for profile badges
const SHADOW_STYLE: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

export interface ProfileData {
  name: string;
  avatarUrl?: string;
  rating?: number;
  isVerified?: boolean;
}

export interface RightAction {
  type: 'icon' | 'text';
  icon?: string;
  text?: string;
  onPress: () => void;
  iconSize?: number;
  color?: string;
}

export interface PageHeaderProps {
  // Required
  onBack: () => void;

  // Title options
  title?: string;
  titleColor?: string;
  titleSize?: number;
  centerTitle?: boolean;

  // Variants
  variant?: 'simple' | 'large' | 'image' | 'profile' | 'profileEdit';

  // Image background variant
  imageSource?: ImageSourcePropType;
  imageHeight?: number;
  overlayColor?: string;

  // Large variant with illustration
  illustrationIcon?: string;
  illustrationSize?: number;
  backgroundColor?: string;

  // Right side actions
  rightAction?: RightAction;

  // Profile variant
  profile?: ProfileData;
  onProfilePress?: () => void;
  onEdit?: () => void;

  // Custom elements for ultimate flexibility
  customLeftElement?: ReactNode;
  customRightElement?: ReactNode;
  customBottomElement?: ReactNode;

  // Styling
  backIconName?: string;
  backIconSize?: number;
  backIconColor?: string;
  paddingHorizontal?: number;
  paddingTop?: number;
  paddingBottom?: number;
  containerStyle?: ViewStyle;

  // Safe area
  safe?: boolean;
}

export const PageHeader: FC<PageHeaderProps> = ({
  onBack,
  title,
  titleColor = palette.codGray,
  titleSize = 18,
  centerTitle = true,
  variant = 'simple',
  imageSource,
  imageHeight = 209,
  overlayColor,
  illustrationIcon,
  illustrationSize = 275,
  backgroundColor,
  rightAction,
  profile,
  onProfilePress,
  onEdit,
  customLeftElement,
  customRightElement,
  customBottomElement,
  backIconName = 'arrow-back',
  backIconSize = 22,
  backIconColor = palette.cornFlower,
  paddingHorizontal = 20,
  paddingTop,
  paddingBottom,
  containerStyle,
}) => {
  // Render back button
  const renderBackButton = (color?: string) => {
    if (customLeftElement) return customLeftElement;

    return (
      <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
        <SvgIcon
          name={backIconName}
          size={backIconSize}
          color={color || backIconColor}
        />
      </TouchableOpacity>
    );
  };

  // Render right element
  const renderRightElement = (defaultColor?: string) => {
    if (customRightElement) return customRightElement;

    if (rightAction) {
      if (rightAction.type === 'icon') {
        return (
          <TouchableOpacity onPress={rightAction.onPress} activeOpacity={0.7}>
            <SvgIcon
              name={rightAction.icon || 'tick'}
              size={rightAction.iconSize || 14}
              color={rightAction.color || defaultColor || palette.cornFlower}
            />
          </TouchableOpacity>
        );
      }

      if (rightAction.type === 'text') {
        return (
          <TouchableOpacity onPress={rightAction.onPress} activeOpacity={0.7}>
            <Text
              medium
              size={titleSize}
              color={rightAction.color || defaultColor || palette.cornFlower}>
              {rightAction.text}
            </Text>
          </TouchableOpacity>
        );
      }
    }

    // Default spacer for centering title
    return <SizedBox width={backIconSize} />;
  };

  // Render title
  const renderTitle = (color?: string) => {
    if (!title) return centerTitle ? null : <Block flex={1} />;

    if (centerTitle) {
      return (
        <Text medium size={titleSize} color={color || titleColor}>
          {title}
        </Text>
      );
    }

    return (
      <Block flex={1} align="center" mr={backIconSize}>
        <Text medium size={titleSize} color={color || titleColor}>
          {title}
        </Text>
      </Block>
    );
  };

  // Render profile rating badge
  const renderRatingBadge = (rating?: number) => (
    <Block
      mt={-20}
      style={SHADOW_STYLE}
      radius={5000}
      row
      justify="center"
      p={6}
      gap={9.67}
      align="center"
      bg="#fff">
      <SvgIcon name="star-gray" size={17} />
      <Text medium color={palette.shaft3}>
        {rating ?? 0}
      </Text>
    </Block>
  );

  // Render verification badge
  const renderVerificationBadge = (isVerified?: boolean) => (
    <Block row gap={12} align="center">
      <Block
        pv={9}
        ph={16}
        radius={30}
        style={{
          borderWidth: 1,
          borderColor: isVerified ? '#4CAF50' : '#FFC634',
        }}>
        <Text color={palette.white} size={12}>
          {isVerified ? 'Verified' : 'Verification Pending'}
        </Text>
      </Block>
      {isVerified ? (
        <SvgIcon name="verified" size={25} color="#4CAF50" />
      ) : (
        <SvgIcon name="alert" size={25} />
      )}
    </Block>
  );

  // ========== VARIANT: Simple ==========
  if (variant === 'simple') {
    return (
      <Block
        pv={paddingBottom ?? 13}
        pt={paddingTop}
        ph={paddingHorizontal}
        justify="space-between"
        row
        align="center"
        style={containerStyle}>
        {renderBackButton()}
        {renderTitle()}
        {renderRightElement()}
      </Block>
    );
  }

  // ========== VARIANT: Large (with illustration) ==========
  if (variant === 'large') {
    return (
      <Block
        overflow="hidden"
        bg={backgroundColor || '#A8D7FD'}
        pt={50}
        height={imageHeight || 270}
        style={containerStyle}>
        <SvgIcon
          name={backIconName}
          size={backIconSize}
          color={backIconColor}
          containerStyle={{
            position: 'absolute',
            zIndex: 9999,
            top: 60,
            left: paddingHorizontal || 22,
          }}
          onPress={onBack}
        />
        {illustrationIcon && (
          <SvgIcon name={illustrationIcon} size={illustrationSize} />
        )}
        {customBottomElement}
      </Block>
    );
  }

  // ========== VARIANT: Image Background ==========
  if (variant === 'image' && imageSource) {
    return (
      <Block height={imageHeight} overflow="hidden" style={containerStyle}>
        <ImageBackground
          source={imageSource}
          style={{flex: 1, justifyContent: 'flex-end'}}
          imageStyle={{height: RH(imageHeight)}}
          resizeMode="cover">
          {overlayColor && (
            <Block
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: overlayColor,
              }}
            />
          )}

          <Block
            ph={paddingHorizontal || 24}
            pv={18}
            pt={46}
            justify="space-between"
            row
            align="flex-end">
            {renderBackButton(palette.white)}
            {renderTitle(palette.white)}
            {renderRightElement(palette.white)}
          </Block>

          {customBottomElement}
        </ImageBackground>
      </Block>
    );
  }

  // ========== VARIANT: Profile (Settings style) ==========
  if (variant === 'profile' && imageSource && profile) {
    return (
      <Block height={imageHeight} style={containerStyle}>
        <ImageBackground
          source={imageSource}
          style={{flex: 1}}
          imageStyle={{height: RH(imageHeight)}}
          resizeMode="cover">
          <Block
            ph={paddingHorizontal || 24}
            pt={paddingTop || 60}
            mb={21}
            overflow="hidden"
            justify="space-between"
            row>
            {renderBackButton(palette.white)}
            {renderTitle(palette.white)}
            {renderRightElement(palette.white)}
          </Block>

          <TouchableOpacity
            onPress={onProfilePress}
            activeOpacity={0.7}
            disabled={!onProfilePress}>
            <Block ph={21} row justify="space-between" align="center">
              <Block align="center" row>
                <Block mr={24}>
                  <Avatar
                    url={profile.avatarUrl}
                    shape="circle"
                    size="medium"
                  />
                  {renderRatingBadge(profile.rating)}
                </Block>
                <Block>
                  <Text size={18} medium color={palette.white}>
                    {profile.name}
                  </Text>
                  <Block mt={12}>
                    {renderVerificationBadge(profile.isVerified)}
                  </Block>
                </Block>
              </Block>
              {onProfilePress && <SvgIcon name="caret-right-white" size={16} />}
            </Block>
          </TouchableOpacity>

          {customBottomElement}
        </ImageBackground>
      </Block>
    );
  }

  // ========== VARIANT: Profile Edit (Profile page style) ==========
  if (variant === 'profileEdit' && imageSource && profile) {
    return (
      <Block height={imageHeight || 313} style={containerStyle}>
        <ImageBackground
          source={imageSource}
          style={{flex: 1}}
          imageStyle={{height: RH(imageHeight || 313)}}
          resizeMode="cover">
          <Block
            ph={paddingHorizontal || 24}
            pt={paddingTop || 70}
            mb={21}
            overflow="hidden"
            justify="space-between"
            row>
            {renderBackButton(palette.white)}
            {onEdit ? (
              <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
                <Text color={palette.white} medium size={titleSize}>
                  Edit
                </Text>
              </TouchableOpacity>
            ) : (
              renderRightElement(palette.white)
            )}
          </Block>

          <Block alignSelf="center">
            <Avatar
              url={profile.avatarUrl}
              shape="circle"
              size="medium"
              style={{borderWidth: 2, borderColor: palette.cornFlower}}
            />
            {renderRatingBadge(profile.rating)}
          </Block>

          <Text center color={palette.white} medium mt={15}>
            {profile.name}
          </Text>

          {customBottomElement}
        </ImageBackground>
      </Block>
    );
  }

  // Fallback to simple variant
  return (
    <Block
      pv={paddingBottom ?? 13}
      pt={paddingTop}
      ph={paddingHorizontal}
      justify="space-between"
      row
      align="center"
      style={containerStyle}>
      {renderBackButton()}
      {renderTitle()}
      {renderRightElement()}
    </Block>
  );
};

export default PageHeader;
