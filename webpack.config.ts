import path from 'path';

import { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import { inDev } from './webpack.helpers';

rules.push();

const config: Configuration = {
	entry: path.resolve(__dirname, 'src/index.tsx'),
	output: {
		path: path.resolve('dist'),
		filename: 'scripts/[name].[contenthash].js',
	},
	module: {
		rules,
	},
	plugins,
	optimization: {
		minimize: true,
		splitChunks: { minChunks: Infinity, chunks: 'all' },
	},
	devtool: inDev() ? 'eval-cheap-module-source-map' : 'source-map',
	target: 'web',
	mode: inDev() ? 'development' : 'production',
	resolve: {
		fallback: {
			"stream": false,
			"buffer": require.resolve("buffer/")
		},
		extensions: ['.cjs','.js', '.ts', '.jsx', '.tsx', '.css'],
		alias: {
			'~': path.resolve(__dirname, 'src'),
		},
	},
	watchOptions: {
		ignored: /node_modules/,
	},
};
// eslint-disable-next-line import/no-default-export
export default config;
