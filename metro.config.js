const {getDefaultConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  defaultConfig.transformer.babelTransformerPath = require.resolve(
    'react-native-svg-transformer',
  );

  defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
    ext => ext !== 'svg',
  );

  defaultConfig.resolver.assetExts.push(
    'bmp',
    'gif',
    'jpeg',
    'jpg',
    'png',
    'webp',
    'tflite',
  );

  defaultConfig.resolver.sourceExts = [
    ...defaultConfig.resolver.sourceExts,
    'svg',
  ];

  return wrapWithReanimatedMetroConfig(defaultConfig);
})();

module.exports = config;
