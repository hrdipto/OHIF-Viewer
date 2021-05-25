// https://developers.google.com/web/tools/workbox/guides/codelabs/webpack
// ~~ WebPack
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackBase = require('../../.webpack/webpack.base.js');
// ~~ Plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// ~~ Rules
const extractStyleChunksRule = require('./.webpack/rules/extractStyleChunks.js');

// ~~ Directories
const SRC_DIR = path.join(__dirname, './src');
const DIST_DIR = path.join(__dirname, './dist');
const PUBLIC_DIR = path.join(__dirname, './public');

// ~~ Env Vars
const HTML_TEMPLATE = 'index.html';
const PUBLIC_URL = process.env.PUBLIC_URL || '/';
const APP_CONFIG = process.env.APP_CONFIG || 'config/default.js';
const PROXY_TARGET = process.env.PROXY_TARGET;
const PROXY_DOMAIN = process.env.PROXY_DOMAIN;
const ENTRY_TARGET = process.env.ENTRY_TARGET || `${SRC_DIR}/index.js`;

module.exports = (env, argv) => {
  const baseConfig = webpackBase(env, argv, { SRC_DIR, DIST_DIR });
  const isProdBuild = process.env.NODE_ENV === 'production';
  const hasProxy = PROXY_TARGET && PROXY_DOMAIN;

  const mergedConfig = merge(baseConfig, {
    entry: ENTRY_TARGET,
    output: {
      path: DIST_DIR,
      publicPath: PUBLIC_URL, // Used by HtmlWebPackPlugin for asset prefix
      filename: 'index_bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000',
        },
        ...extractStyleChunksRule(false),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),

      new webpack.ProvidePlugin({
        React: 'react',
      }),

      new CopyWebpackPlugin([
        {
          from: PUBLIC_DIR,
          to: DIST_DIR,
          toType: 'dir',
          // Ignore our HtmlWebpackPlugin template file
          // Ignore our configuration files
          ignore: ['config/*', 'html-templates/*', '.DS_Store'],
        },
        // Short term solution to make sure GCloud config is available in output
        // for our docker implementation
        {
          from: `${PUBLIC_DIR}/config/google.js`,
          to: `${DIST_DIR}/google.js`,
        },
        // Copy over and rename our target app config file
        {
          from: `${PUBLIC_DIR}/${APP_CONFIG}`,
          to: `${DIST_DIR}/app-config.js`,
        },
      ]),
      // new HtmlWebpackPlugin(),
      new HtmlWebpackPlugin({
        // template: `${PUBLIC_DIR}/${HTML_TEMPLATE}`,
        template: `${PUBLIC_DIR}/html-templates/${HTML_TEMPLATE}`,
        filename: 'index.html',
        templateParameters: {
          PUBLIC_URL,
        },
      }),
      // new MiniCssExtractPlugin()
    ],

    devServer: {
      // gzip compression of everything served
      // Causes Cypress: `wait-on` issue in CI
      // compress: true,
      // http2: true,
      // https: true,
      hot: true,
      open: true,
      port: 3003,
      host: '0.0.0.0',
      public: 'http://localhost:3003',
      historyApiFallback: {
        disableDotRule: true,
      },

      // contentBase: [path.join(__dirname, '/public'), path.join(__dirname, '/assets')]
    },

    resolve: {
      alias: {
        '@fuse': path.resolve(__dirname, '../fuse/src/@fuse'),
        '@history': path.resolve(__dirname, '../fuse/src/@history/'),
        '@lodash': path.resolve(__dirname, '../fuse/src/@lodash'),
        i18n: path.resolve(__dirname, './src/i18n'),
        app: path.resolve(__dirname, './src/app/'),
      },
    },
  });

  if (hasProxy) {
    mergedConfig.devServer.proxy = {};
    mergedConfig.devServer.proxy[PROXY_TARGET] = PROXY_DOMAIN;
  }

  if (!isProdBuild) {
    mergedConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  return mergedConfig;
};
