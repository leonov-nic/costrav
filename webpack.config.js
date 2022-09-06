const path = require("path")
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

module.exports = {
  context: path.resolve(__dirname, 'source'),
  mode: 'development',
  entry: {main: './js/main.js'},
  devtool: isDev ? 'source-map' : false,
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, "build"),
  },
  optimization: {
    minimize: isDev ? false : true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
}
