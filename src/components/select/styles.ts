import {RF, RH, RS} from '@helpers';
import {family, palette} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  error: {
    fontSize: RF(10),
    color: 'red',
    fontFamily: family.Regular,
    alignSelf: 'flex-start',
    marginTop: RS(5),
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: palette.border2,
    paddingHorizontal: RS(16),
    height: RH(68),
  },
  selectPressable: {
    borderWidth: 0,
    height: '100%',
  },
  selectText: {
    fontFamily: family.Regular,
    fontSize: RF(14),
    color: palette.shaft2,
  },
  selectItem: {
    marginHorizontal: RS(20),
    paddingVertical: RS(16),
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  label: {
    color: palette.burnt,
    alignSelf: 'flex-start',
    paddingHorizontal: RS(8),
    paddingTop: 8,
  },
});

export default styles;
