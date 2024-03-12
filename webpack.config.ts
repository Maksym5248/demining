import path from 'path';

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import { inDev } from './webpack.helpers';

const config = {
	entry: path.resolve(__dirname, 'src/index.tsx'),
	output: {
		path: path.resolve('dist'),
		filename: 'scripts/[name].[contenthash].js',
	},
	module: {
		rules,
	},
	plugins,
	optimization: inDev()
		? {}
		: {
			minimize: !inDev(),
			minimizer: [`...`, new CssMinimizerPlugin()],
			mangleWasmImports: true,
			splitChunks: { minChunks: Infinity, chunks: 'all' },
		},
	devtool: inDev() ? 'eval-cheap-module-source-map' : false,
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
	devServer: {
		compress: true,
		hot: true,
		liveReload: false,
		historyApiFallback: true,
		port: 8080,
		watchFiles: {
			paths: ['./src/**/*.(svg|ts|tsx)'],
			options: {
				ignored: ['./src/**/__tests__/*', './src/**/__mocks__/*'],
			},
		},
	},
};
// eslint-disable-next-line import/no-default-export
export default config;
