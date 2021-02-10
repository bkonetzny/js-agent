const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		"ui": './ui/scripts/ui.ts',
		"engine": "./engine/game.js"
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
			chunks: ["ui", "vendor"],
			title:"JS DEV",
			template:"ui/index.ejs"
		}),
	]
};