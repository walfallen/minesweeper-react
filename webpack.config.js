const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkg = require('./package.json');

module.exports = (env, argv) => {
	const mode = !argv || argv.mode !== 'development' ? 'production' : 'development';
	return {
		mode,
		devtool: mode !== 'production' ? 'source-map' : undefined,
		entry: {
			app: './src/index.tsx',
			vendor: Object.keys(pkg.dependencies),
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist/static')
		},
		devServer: {
			contentBase: './dist',
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendors: {
						test: /node_modules/,
						name: 'vendor',
						enforce: true,
						chunks: 'all'
					}
				}
			}
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: 'ts-loader',
				},
				{
					enforce: 'pre',
					test: /\.js$/,
					use: 'source-map-loader',
				},
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								url: false,
								sourceMap: mode === 'development'
							}
						},
						{
							loader: 'sass-loader',
							options: {
								url: false,
								sourceMap: mode === 'development'
							}
						},
					],
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[name].css',
			})
		],
	};
};
