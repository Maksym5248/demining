import { Configuration } from 'webpack';

import { inDev } from './webpack.helpers';
import { rules } from './webpack.rules';


export const mainConfig: Configuration = {
	/**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
	entry: './src/main.ts',
	// Put your normal webpack config below here
	module: {
		rules,
	},
	mode: inDev() ? 'development' : 'production',
	target: 'electron-main',
	devtool: inDev() ? 'eval-cheap-module-source-map' : 'source-map',
	resolve: {
		extensions: ['.cjs','.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
	},
};
