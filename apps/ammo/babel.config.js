module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          "~/api": "./src/api",
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
  ]
};
