module.exports = (api) => {
  const isProd = api.env('production');

  const plugins = [
    [
      'module-resolver',
      {
        alias: {
          "~/api": "./src/api",
          '~/core': './src/core',
          '~/components': './src/components',
          '~/containers': './src/containers',
          '~/config': './src/config',
          '~/constants': './src/constants',
          '~/db': './src/db',
          '~/hooks': './src/hooks',
          '~/localization': './src/localization',
          '~/modals': './src/modals',
          '~/stores': './src/stores',
          '~/navigation': './src/navigation',
          '~/screens': './src/screens',
          '~/services': './src/services',
          '~/styles': './src/styles',
          '~/utils': './src/utils',
          '~/context': './src/context',
          '~/types': './src/types',
          '~/assets': './assets'
        },
      },
    ],
    ['react-native-reanimated/plugin', {
      relativeSourceLocation: true,
    }]
  ];

  if (isProd) {
    plugins.push(['transform-remove-console']);
  }

  return {
    presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],
    plugins,
  };
};
