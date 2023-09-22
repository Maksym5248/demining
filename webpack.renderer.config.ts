import path from 'path';

import { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      "~/components": path.resolve(__dirname, "./src/components"),
      "~/containers": path.resolve(__dirname, "./src/containers"),
      "~/constants": path.resolve(__dirname, "/src/constants"),
      "~/hooks": path.resolve(__dirname, "./src/hooks"),
      "~/stores": path.resolve(__dirname, "./src/stores"),
      "~/routes": path.resolve(__dirname, "./src/routes"),
      "~/pages": path.resolve(__dirname, "./src/pages"),
      "~/services": path.resolve(__dirname, "./src/services"),
      "~/styles": path.resolve(__dirname, "./src/styles"),
      "~/utils": path.resolve(__dirname, "./src/utils"),
      "~/types": path.resolve(__dirname, "./src/types")
    },
  },
};
