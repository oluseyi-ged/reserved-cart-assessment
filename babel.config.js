module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src/'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@helpers': './src/helpers',
          '@theme': './src/theme',
          '@routes': './src/routes',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@slices': './src/slices',
          '@types': './src/types',
          store: './src/store',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
