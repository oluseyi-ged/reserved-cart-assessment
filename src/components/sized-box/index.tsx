/* eslint-disable react-native/no-inline-styles */
import {RS} from '@helpers';
import React from 'react';
import {View} from 'react-native';

/* ANCHOR SIZED BOX */
interface SizedBox {
  height?: number;
  width?: number | string;
  backgroundColor?: any;
  style?: any;
  flex?: number;
  borderColor?: string;
  // Padding props
  p?: number;
  ph?: number;
  pv?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  // Margin props
  m?: number;
  mh?: number;
  mv?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
}

export const SizedBox = ({
  width,
  height,
  flex,
  backgroundColor,
  borderColor,
  style,
  // Padding props
  p,
  ph,
  pv,
  pt,
  pb,
  pl,
  pr,
  // Margin props
  m,
  mh,
  mv,
  mt,
  mb,
  ml,
  mr,
}: SizedBox) => {
  return (
    <View
      style={[
        {
          width,
          height,
          flex,
          backgroundColor,
        },
        // Padding
        p !== undefined && {padding: RS(p)},
        ph !== undefined && {paddingHorizontal: RS(ph)},
        pv !== undefined && {paddingVertical: RS(pv)},
        pt !== undefined && {paddingTop: RS(pt)},
        pb !== undefined && {paddingBottom: RS(pb)},
        pl !== undefined && {paddingLeft: RS(pl)},
        pr !== undefined && {paddingRight: RS(pr)},
        // Margin
        m !== undefined && {margin: RS(m)},
        mh !== undefined && {marginHorizontal: RS(mh)},
        mv !== undefined && {marginVertical: RS(mv)},
        mt !== undefined && {marginTop: RS(mt)},
        mb !== undefined && {marginBottom: RS(mb)},
        ml !== undefined && {marginLeft: RS(ml)},
        mr !== undefined && {marginRight: RS(mr)},
        borderColor && {borderWidth: 0.331, borderColor},
        style,
      ]}
    />
  );
};
