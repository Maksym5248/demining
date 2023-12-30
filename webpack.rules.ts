import { ModuleOptions } from 'webpack';

export const rules: Required<ModuleOptions>['rules'] = [
	// Add support for native node modules
	{
		// We're specifying native_modules in the test because the asset relocator loader generates a
		// "fake" .node file which is really a cjs file.
		test: /native_modules[/\\].+\.node$/,
		use: 'node-loader',
	},
	{
		test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
		parser: { amd: false },
		use: {
			loader: '@vercel/webpack-asset-relocator-loader',
			options: {
				outputAssetBase: 'native_modules',
			},
		},
	},
	{
		test: /\.(js|jsx|ts|tsx)$/,
		exclude: /node_modules|\.webpack/,
		use: {
			loader: 'babel-loader',
		}
	},
	{
		// Exclude `js` files to keep "css" loader working as it injects
		// its runtime that would otherwise be processed through "file" loader.
		// Also exclude `html` and `json` extensions so they get processed
		// by webpacks internal loaders.
		exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
		loader: require.resolve('file-loader'),
	},
];
