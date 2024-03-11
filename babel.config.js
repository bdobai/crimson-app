process.env.EXPO_ROUTER_APP_ROOT = './src/app';

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          root: ['.'],
          alias: {
            '@app': './src',
            '@app/assets': './src/assets',
            '@app/components': './src/components',
            '@app/types': './src/types',
            '@animations': './src/modules/animations',
          },
        },
      ],
    ],
  };
};
