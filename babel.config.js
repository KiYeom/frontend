module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '~': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@assets': './src/assets',
            '@query': './src/query',
            '@hooks': './src/hooks',
            '@apis': './src/apis',
          },
        },
      ],
      ['react-native-reanimated/plugin'],
    ],
  };
};
