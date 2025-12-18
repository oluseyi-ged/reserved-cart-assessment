import {XBg} from '@assets/images';
import {Block, SizedBox} from '@components';
import {RH, RS, RW} from '@helpers';
import {Skeleton} from '@rneui/themed';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const HomeSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <Block flex={1}>
      {/* Header Section */}
      <Block
        height={RH(440)}
        backgroundImage={XBg}
        imageStyle={{
          transform: [{translateY: 250}],
        }}
        style={{
          paddingHorizontal: RS(10),
        }}>
        {/* User and Notification Area */}
        <Block row justify="space-between" align="center">
          <Block row gap={8} align="center">
            <Skeleton animation="wave" circle width={RW(40)} height={RH(40)} />
            <Skeleton animation="wave" width={RW(100)} height={RH(20)} />
          </Block>
          <Block row gap={8} align="center">
            <Skeleton
              animation="wave"
              width={RW(80)}
              height={RH(28)}
              style={{borderRadius: RS(50)}}
            />
          </Block>
        </Block>

        <SizedBox height={RH(37)} />

        {/* Currency Selector */}
        <Block align="center">
          <Skeleton
            animation="wave"
            width={RW(120)}
            height={RH(40)}
            style={{borderRadius: RS(50)}}
          />
        </Block>

        <SizedBox height={RH(16)} />

        {/* Balance Section */}
        <Block align="center">
          <Skeleton animation="wave" width={RW(150)} height={RH(16)} />
          <SizedBox height={RH(8)} />
          <Block row justify="center" align="center" gap={RS(16)}>
            <Skeleton animation="wave" width={RW(200)} height={RH(48)} />
          </Block>
        </Block>

        <SizedBox height={RH(40)} />

        {/* Quick Actions */}
        <Block row justify="space-around">
          {[1, 2, 3, 4, 5].map(item => (
            <Block key={item} align="center" gap={RS(10)}>
              <Skeleton
                animation="wave"
                circle
                width={RW(56)}
                height={RH(56)}
              />
              <Skeleton animation="wave" width={RW(50)} height={RH(12)} />
            </Block>
          ))}
        </Block>
      </Block>

      {/* Content Section */}
      <Block bg="#FAFAFF" style={{padding: RS(24)}}>
        {/* KYC Progress Skeleton */}
        <Skeleton
          animation="wave"
          width="100%"
          height={RH(120)}
          style={{borderRadius: RS(8), marginBottom: RS(24)}}
        />

        {/* For You Section */}
        <Skeleton animation="wave" width={RW(100)} height={RH(16)} />
        <SizedBox height={RH(16)} />
        <Block row gap={RS(8)}>
          {[1, 2].map(item => (
            <Skeleton
              animation="wave"
              key={item}
              width={RW(200)}
              height={RH(120)}
              style={{borderRadius: RS(8)}}
            />
          ))}
        </Block>

        <SizedBox height={RH(24)} />

        {/* Transactions Section */}
        <Skeleton animation="wave" width={RW(150)} height={RH(16)} />
        <SizedBox height={RH(16)} />
        <Block gap={RS(10)}>
          {[1, 2, 3].map(item => (
            <Skeleton
              animation="wave"
              key={item}
              width="100%"
              height={RH(80)}
              style={{borderRadius: RS(8)}}
            />
          ))}
        </Block>
      </Block>
    </Block>
  );
};
