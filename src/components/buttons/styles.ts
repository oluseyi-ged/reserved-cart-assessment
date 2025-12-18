import {RF, RS} from '@helpers';
import {family, palette} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  containerCommonStyle: {
    backgroundColor: 'red',
    paddingVertical: RS(18),
    width: '100%',
    borderRadius: RS(100),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  textCommonStyle: {
    color: palette.textWhite,
    fontSize: RF(12),
    fontFamily: family.Medium,
  },

  borderStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: RS(8),
    borderColor: '#24B467',
  },
  borderTextStyle: {
    color: palette.purple,
    fontSize: RF(14),
    fontFamily: family.Regular,
  },
  iconContainer: {
    marginRight: RS(5),
  },
  secondaryStyle: {
    backgroundColor: palette.purpleFade,
    borderWidth: 1,
    borderRadius: RS(6),
    borderColor: palette.borderGreen,
  },
});

export default styles;
