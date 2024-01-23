import { Configuration } from 'webpack';

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
	target: 'electron-main',
	resolve: {
		fallback: {
			"path": false,
			"fs": false,
		},
		extensions: ['.cjs','.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
	},
};
