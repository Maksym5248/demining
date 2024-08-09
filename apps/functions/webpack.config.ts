import path from 'path';

import Dotenv from 'dotenv-webpack';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

function inDev() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

const rules = [
    {
        test: /\.([cm]?ts|tsx)$/,
        use: {
            loader: 'ts-loader',
            options: {
                transpileOnly: true,
            },
        },
        exclude: /node_modules/,
    },
];

const config = {
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        path: path.resolve('dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs',
    },
    devtool: inDev() ? 'inline-source-map' : false,
    target: 'node',
    externals: [nodeExternals()],
    mode: inDev() ? 'development' : 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new Dotenv(),
    ],
    module: {
        rules,
    },
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                },
            }),
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        extensionAlias: {
            '.js': ['.js', '.ts'],
            '.cjs': ['.cjs', '.cts'],
            '.mjs': ['.mjs', '.mts'],
        },
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
