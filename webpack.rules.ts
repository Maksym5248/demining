import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ModuleOptions } from 'webpack';

import { inDev } from './webpack.helpers';

export const rules: Required<ModuleOptions>['rules'] = [
	{
		test: /\.(js|jsx|ts|tsx)$/,
		exclude: /node_modules/,
		loader: 'babel-loader',
	},
	{
		test: /\.css$/,
		use: [
			{ loader: inDev() ? 'style-loader' : MiniCssExtractPlugin.loader },
			{ loader: 'css-loader' },
		],
	},
	{
		test: /\.svg$/,
		use: ['@svgr/webpack'],
	},
	{
		test: /\.(ttf|png|woff|woff2|gif)$/i,
		type: 'asset/resource',
		generator: {
			filename: 'static/[hash][ext]',
		},
	},
];
