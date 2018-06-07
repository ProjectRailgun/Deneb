const path = require('path');

const DefinePlugin = require('webpack/lib/DefinePlugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const CopyWebpckPlugin = require('copy-webpack-plugin');

const env = require('./env');

let isProd = process.env.NODE_ENV === 'production';
let vega_host = isProd ? env.prod.vega_host : env.dev.vega_host;
let extension_id = isProd ? env.prod.extension_id : env.dev.extension_id;
let watch = !isProd;

module.exports = {
    watch: watch,
    entry: {
        backend: './src/event-page.ts',
        // popup: './src/popup.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: 'sourcemap',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new CopyWebpckPlugin([
            {
                from: 'src',
                ignore: ['*.ts']
            }
        ]),
        new DefinePlugin({
            VEGA_HOST: JSON.stringify(vega_host),
            EXTENSION_ID: JSON.stringify(extension_id)
        })
    ]
};