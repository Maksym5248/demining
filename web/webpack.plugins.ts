import path from 'path';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin' ;
import { sentryWebpackPlugin } from '@sentry/webpack-plugin' ;
import Dotenv from 'dotenv-webpack' ;
import webpack from 'webpack' ;
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

import { inDev } from './webpack.helpers';


require('dotenv').config();

export const plugins = [
	new CopyPlugin({
		patterns: [
		  { from: 'assets/icon.ico', to: 'icon.ico' },
		],
	}),
	new HtmlWebpackPlugin({
		template: path.resolve(__dirname, 'public/index.html'),
	}),
	new webpack.ProvidePlugin({
		Buffer: ['buffer', 'Buffer'],
	}),
	new ForkTsCheckerWebpackPlugin(),
	new Dotenv(),
	inDev() && new ReactRefreshWebpackPlugin(),
	!inDev() && new MiniCssExtractPlugin({
		filename: '[name].[chunkhash].css',
		chunkFilename: '[name].[chunkhash].chunk.css',
	}),
	!inDev() && sentryWebpackPlugin({
		authToken: process.env.SENTRY_AUTH_TOKEN,
		org: "realty-jo",
		project: "dsns",
	  }),
].filter(Boolean)