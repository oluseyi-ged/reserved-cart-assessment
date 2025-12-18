import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Horizontal scale factor
const HS = (size: number): number => (width / guidelineBaseWidth) * size;
// Vertical scale factor
const VS = (size: number): number => (height / guidelineBaseHeight) * size;
// Moderate scale factor
const MS = (size: number, factor: number = 0.5): number =>
  size + (HS(size) - size) * factor;

export {HS, MS, VS};
