const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

module.exports = {
    mode: process.env.NODE_ENV,
    devtool: false,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: 'main.js'
        filename: '[name].js',
    },
    // 当你已经有一个后台接口API服务器的可以直接 代理过去
    proxy: {
        '/api1': {
            target: 'http://localhost:3000',
            pathRewrite: {
                '^/api': '',
                '^/home/name/api': '/home/name',
            },
        },
        '/api2': {
            target: 'http://localhost:4000',
            pathRewrite: {
                '^/api': '',
                '^/home/name/api': '/home/name',
            },
        },
    },
    // 如果你没有后台服务器，直接把mock功能直接定义在这里
    onBeforeSetupMiddleware(devServer) {
        // app其实就是webpack-dev-sever里面的express的app
        devServer.app.get('/xxx', (req, res) => {
            res.json({
                id: 1, name: 'zhufeng',
            });
        });
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                options: { fix: true },
                enforce: 'pre', // 指定loader的类型 pre normal post inline
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
                            ['@babel/plugin-proposal-private-methods', { loose: true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                // 最右侧的loader读的是源文件内容 最左侧的loader一定会返回一个js模块
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.png$/, // 会把png图片自动拷贝到输出目录中，并返回新路径或者说名称
                // use:["file-loader"],
                type: 'asset/resource',
                generator: {
                    filename: 'png/[hash][ext]',
                },
            },
            {
                test: /\.ico$/, // 会把ico文件变成base64字符串并返回给调用者
                // use:["url-loader"],
                type: 'asset/inline',
            },
            {
                test: /\.txt$/, // 会把txt内容直接返回
                // use:["raw-loader"],
                type: 'asset/source',
            },
            {
                test: /\.svg$/,
                // use:["raw-loader"],
                type: 'asset/resource',
            },
            {
                test: /\.jpg$/,
                // use:["raw-loader"],
                type: 'asset', // 表示可以根据实际情况进行自选择是resource还inline
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024, // 如果文件大小小于4K就走inline,如果大于4K就resource
                    },
                },
                generator: {
                    filename: 'jpg/[hash][ext]',
                },
            },
        ],
    },
    devServer: {
        port: 8080,
        open: true,
        static: path.resolve(__dirname, 'public'),
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV1': JSON.stringify(process.env.NODE_ENV),
            a: JSON.stringify('zhou'),
        }),
    ],
};
