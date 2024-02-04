import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin' ;
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin' ;
import { sentryWebpackPlugin } from '@sentry/webpack-plugin' ;
import Dotenv from 'dotenv-webpack' ;
import webpack from 'webpack' ;

import { inDev } from './webpack.helpers';

require('dotenv').config();

export const plugins = [
	new webpack.ProvidePlugin({
		Buffer: ['buffer', 'Buffer'],
	}),
	new ForkTsCheckerWebpackPlugin(),
	new ReactRefreshWebpackPlugin(),
	new MiniCssExtractPlugin({
		filename: '[name].[chunkhash].css',
		chunkFilename: '[name].[chunkhash].chunk.css',
	}),
	new Dotenv(),
	...(inDev()
		? []
		: [
			sentryWebpackPlugin({
				authToken: process.env.SENTRY_AUTH_TOKEN,
				org: "realty-jo",
				project: "dsns",
			  })
		]),
].filter(Boolean)
