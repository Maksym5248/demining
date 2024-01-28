import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin' ;
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin' ;
import { sentryWebpackPlugin } from '@sentry/webpack-plugin' ;

export const plugins = [
	new ForkTsCheckerWebpackPlugin(),
	new ReactRefreshWebpackPlugin(),
	new MiniCssExtractPlugin({
		filename: '[name].[chunkhash].css',
		chunkFilename: '[name].[chunkhash].chunk.css',
	}),
	sentryWebpackPlugin({
		// SENTRY_AUTH_TOKEN
		authToken: "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",
		org: "realty-jo",
		project: "dsns",
	  }),
].filter(Boolean)
