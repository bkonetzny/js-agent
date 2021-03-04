const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (argv) => {
	const config = {
		mode: argv.mode || "development",
		entry: {
			"ui": './ui/scripts/ui.ts',
			"engine": "./engine/game.ts"
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					chunks: "all",
					vendor: {
						test: /node_modules/,
						chunks: Infinity,
						name: "vendor",
						priority: 10,
						enforce: true,
						chunks: "all",
						reuseExistingChunk: true
					}
				}
			},
			runtimeChunk: {
				name: "vendor"
			}
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.css$/i,
					use: ["style-loader", "css-loader"],
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist'),
		},
		plugins: [
			new HtmlWebpackPlugin({
				chunks: ["ui", "engine", "vendor"],
				title:"JS DEV",
				template:"ui/index.ejs"
			}),
			new CopyPlugin({
				patterns: [
					{ from: "ui/assets", to: "assets" }
				],
			})
		]
	}

	return config;
}