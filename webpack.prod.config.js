const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const PreloadWebpackPlugin = require('preload-webpack-plugin');



module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: ''
    },
    mode: 'production',

    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|ico)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images',
                        name: '[name].[ext]',
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env'],
                        plugins: ['transform-class-properties']
                    }
                }
            },
            {
                test: /\.(html)$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src', 'link:href']
                        }
                    }
                ]
            } 
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.[contenthash].css'
        }),
        new CleanWebpackPlugin('dist'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new PreloadWebpackPlugin()
    ]
}
