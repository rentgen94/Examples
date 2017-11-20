const webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    context: `${__dirname}/assets`,
    entry: {
        App: './javascripts/index.js',
    },
    output: {
        path: (NODE_ENV === 'development') ? `${__dirname}/static/build` : `${__dirname}/final`,
        filename: NODE_ENV === 'development' ? '[name].js' : '[name]-final.js',
        publicPath: (NODE_ENV === 'development') ? '/static/build' : '/final',
        library: '[name]',
    },

    module: {
        loaders: [
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.js$/,
                include: `${__dirname}\\assets\\javascripts`,                
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ["es2015"],
                }
            },
            {
                test: /\.(png|jpg|gif|svg|ttf|eot|woff|woff2)$/,
                loader: 'url-loader?limit=4096&name=[path][name].[ext]',
            }
            // {
            //     test: /\.(html)$/,
            //     include: `${__dirname}`,
            //     use: {
            //         loader: 'html-loader',
            //         options: {
            //             attrs: [':data-src']
            //         } 
            //     }
            // }
        ]
    },
    plugins: [
        new ExtractTextPlugin(NODE_ENV === 'development'? 'AllStyles.css' : 'AllStyles-final.css')
    ],

    watch: NODE_ENV === 'development',
    watchOptions: {
        aggregateTimeout: 100,
    },

    devtool: NODE_ENV === 'development' ? 'cheap-inline-module-source-map' : false,

};