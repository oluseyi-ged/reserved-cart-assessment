import {RF, RS, SCREEN_HEIGHT, SCREEN_WIDTH} from '@helpers';
import {family, palette} from '@theme';
import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#FAFAFF',
    borderRadius: RS(25),
    position: 'absolute',
    width: width * 0.95,
    alignSelf: 'center',
    bottom: 0,
  },
  modalHeader: {
    fontSize: RF(20),
    fontFamily: family.Bold,
    color: palette.purple,
  },
  modalCTA: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn1: {
    color: palette.purple,
    fontSize: RF(14),
    fontFamily: family.Medium,
  },
  btn2: {
    color: palette.orange,
    fontSize: RF(14),
    fontFamily: family.Medium,
  },
  modalBar: {
    width: RS(30),
    height: RS(4),
    backgroundColor: '#ACACAC',
    borderRadius: RS(50),
    alignSelf: 'center',
    marginTop: RS(12),
  },
  blurTouchable: {
    flex: 1,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    marginHorizontal: 0,
    // justifyContent: 'flex-end',
  },
});

export default styles;
