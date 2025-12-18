import {RF, RH, RS, RW} from '@helpers';
import {family, palette} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    height: RH(68),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  label: {
    fontSize: RF(10),
    color: palette.burnt,
    alignSelf: 'flex-start',
    paddingHorizontal: RS(24),
    paddingVertical: 6,
  },
  error: {
    fontSize: RF(10),
    color: 'red',
    fontFamily: family.Regular,
    alignSelf: 'flex-start',
    marginTop: RS(5),
  },
  bordered: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.mutedGreen,
  },
  bvnLength: {
    position: 'absolute',
    bottom: RS(-5),
    right: 0,
    fontSize: RF(8),
    color: palette.grey,
  },
  info: {
    fontSize: RF(10),
    color: '#4C4D4D',
    fontFamily: family.Regular,
    alignSelf: 'flex-start',
  },
  infoBox: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    right: 50,
    top: -30,
    height: RH(47),
    width: RW(159),
    position: 'absolute',
  },
  labelAbsolute: {
    position: 'absolute',
    left: RS(24),
    top: 8,
    zIndex: 9999,
    backgroundColor: 'transparent',
  },
});

export default styles;
