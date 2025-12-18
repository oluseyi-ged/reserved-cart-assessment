import {SCREEN_WIDTH} from '@helpers';
import {palette} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  dialPadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
    borderRadius: 50,
    borderColor: palette.concrete,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    flex: 1,
  },
  dialBox: {
    alignSelf: 'center',
    gap: 32,
    width: SCREEN_WIDTH * 0.8,
  },
});

export default styles;
