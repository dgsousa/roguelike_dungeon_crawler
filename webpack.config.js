var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
	context: __dirname + '/app',
	entry: './index.jsx',
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
					{
						test: /\.(jsx|js)$/,
						exclude: '/node_modules/',
						loader: 'babel-loader'
					},
					{
						test: /\.scss$/,
						loader: ExtractTextPlugin.extract({
							fallback: "style-loader", 
							use: "css-loader!sass-loader"
						})
					},
					{
						test: /rot\.js$/,
						loaders: ["exports-loader?ROT"]
					},
					{
						test: /\.png$/,
						loader: 'url-loader'
					}

		]
	},
	plugins: [
		new ExtractTextPlugin("[name].css")
	]
}