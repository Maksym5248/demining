import path from 'path';

import { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin' ;

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import { inDev } from './webpack.helpers';

rules.push({
	test: /\.css$/,
	use: [
		{ loader: inDev() ? 'style-loader' : MiniCssExtractPlugin.loader },
		{ loader: 'css-loader' },
	],
});

export const rendererConfig: Configuration = {
	module: {
		rules,
	},
	plugins,
	devtool: inDev() ? 'eval-cheap-module-source-map' : 'source-map',
	target: 'electron-renderer',
	mode: inDev() ? 'development' : 'production',
	resolve: {
		fallback: {
			"path": false,
			"fs": false,
		},
		extensions: ['.cjs','.js', '.ts', '.jsx', '.tsx', '.css'],
		alias: {
			"~/api": path.resolve(__dirname, "./src/api"),
			"~/components": path.resolve(__dirname, "./src/components"),
			"~/config": path.resolve(__dirname, "./src/config"),
			"~/constants": path.resolve(__dirname, "/src/constants"),
			"~/containers": path.resolve(__dirname, "./src/containers"),
			"~/db": path.resolve(__dirname, "./src/db"),
			"~/drawers": path.resolve(__dirname, "./src/drawers"),
			"~/modals": path.resolve(__dirname, "./src/modals"),
			"~/hooks": path.resolve(__dirname, "./src/hooks"),
			"~/stores": path.resolve(__dirname, "./src/stores"),
			"~/routes": path.resolve(__dirname, "./src/routes"),
			"~/pages": path.resolve(__dirname, "./src/pages"),
			"~/services": path.resolve(__dirname, "./src/services"),
			"~/styles": path.resolve(__dirname, "./src/styles"),
			"~/utils": path.resolve(__dirname, "./src/utils"),
			"~/types": path.resolve(__dirname, "./src/types"),
			"~/context": path.resolve(__dirname, "./src/context")
		},
	},
};
