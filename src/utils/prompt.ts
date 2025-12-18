import Toast from 'react-native-simple-toast';

// Show toast message
export const showToastMessage = (message: string) => {
  setTimeout(() => {
    Toast.show(message, Toast.LONG);
  }, 500);
};
