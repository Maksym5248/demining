import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin' ;
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin' ;

export const plugins = [
  new ForkTsCheckerWebpackPlugin(),
  new ReactRefreshWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash].css',
    chunkFilename: '[name].[chunkhash].chunk.css',
  }),
].filter(Boolean)
