const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

module.exports = {
  target: 'web',
  context: srcPath,
  entry: './index.js',
  devServer: {
    contentBase: distPath,
    historyApiFallback: true,
  },
  output: {
    path: distPath,
    filename: 'graphiql.js',
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['*', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'GraphiQL',
      template: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        API_HOST: JSON.stringify(process.env.API_HOST ? process.env.API_HOST : ''),
      },
    }),
  ],
};
