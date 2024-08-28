module.exports = (api) => {
  const isProd = api.env('production');

  const plugins = [
    [
      'module-resolver',
      {
        alias: {
          "shared-my/common": "../../packages/shared/src/common",
          "shared-my/db": "../../packages/shared/src/db",
          "shared-my-client/api": "../../packages/shared-client/src/api",
          "shared-my-client/common": "../../packages/shared-client/src/common",
          "shared-my-client/map": "../../packages/shared-client/src/map",
          "shared-my-client/models": "../../packages/shared-client/src/models",
          "shared-my-client/services": "../../packages/shared-client/src/services",
          "shared-my-client/stores": "../../packages/shared-client/src/stores",
          "~/api": "./src/api",
          '~/core': './src/core',
          '~/components': './src/components',
          '~/containers': './src/containers',
          '~/config': './src/config',
          '~/constants': './src/constants',
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
    // ['react-native-reanimated/plugin', {
    //   relativeSourceLocation: true,
    // }]
  ];

  if (isProd) {
    plugins.push(['transform-remove-console']);
  }

  return {
    presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],
    plugins,
  };
};
