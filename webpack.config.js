const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new UglifyJsPlugin({ sourceMap: true }),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'My Project',
            template: './src/index.html',
            inject: 'body'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/,
                    /spec/
                ],
                loader: "babel-loader",
                options: {
                  presets: ['es2015']
                }
              },
              {
                test: /\.mp3$/,
                loader: 'file-loader'
              },
              {
                test: /\.wav$/,
                loader: 'file-loader'
              }

            ]
          }
        };
