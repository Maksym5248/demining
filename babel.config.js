module.exports = (api) => {
  const isProd = api.env('production');

  const plugins = [
    "@emotion/babel-plugin"
  ];

  // if (isProd) {
  //   plugins.push(['transform-remove-console']);
  // }

  return {
    presets: [
      ["@babel/preset-env", { "targets": "defaults" }],
      ["@babel/preset-react", {"runtime": "automatic", importSource: '@emotion/react'}],
      ["@babel/preset-typescript"]
    ],
    plugins,
  };
};
