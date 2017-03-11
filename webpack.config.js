module.exports = {
	context: __dirname + '/app',
	entry: './index.jsx',
	output: {
		path: 'public',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
					{
						test: /\.jsx$/,
						exlude: '/node_modules/',
						loader: 'babel-loader'
					},
					{
						test: /\.scss$/,
						loaders: ["style", "css", "sass"]
					}

		]
	}
}