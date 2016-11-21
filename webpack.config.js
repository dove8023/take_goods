var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    // devtool: "source-map",
    entry: {
        "login" : [
            __dirname+'/static/entries/login.js'
            ],
        "index" : [
            __dirname+'/static/entries/index.js',
            ],
       /* "common": [
            __dirname + '/static/js/libs/jquery/jquery.min',
            __dirname+'/static/entries/common.js'
        ]*/
    },
    output: {
        path: __dirname + "/static/dist",//打包后的文件存放的地方
        filename: "[name].js"//打包后输出文件的文件名
    },
    /*devServer: {
        contentBase: "./public",
        colors: true,
        historyApiFallback: true,
        inline: true,
        port: 3000
    },*/


    module:{
        loaders:[
            {
                test: /\.json$/,
                loader: "json"
            },

            {
                test: /\.js|jsx$/,
                exclude : /node_modules/,
                loader: "babel",
                query : {
                    presets : ['es2015' , 'react']
                }
            },

            {
                test: /\.css$/,
                // loader: ExtractTextPlugin.extract('style', 'css?modules!postcss')
                // { test: /\.css$/, loader: 'style-loader!css-loader' },
                loader: 'style-loader!css-loader'
            },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
        ],

        
    },
    postcss: [
        require("autoprefixer")
    ],
    resolve: {
        extensions: ['','.js','.jsx','.json','.css'],
        alias: {
            // 'jQuery': __dirname + '/static/js/libs/jquery/jquery.min',
            // '$': __dirname + '/static/js/libs/jquery/jquery.min',
        }
    },

    plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("style.css"),
        new webpack.optimize.CommonsChunkPlugin('common.js', ['login', 'index']),
        new webpack.ProvidePlugin({
            $: __dirname + '/static/js/libs/jquery/jquery.min',
            // jQuery: __dirname + '/static/js/libs/jquery/jquery.min',
        })
    ]
}