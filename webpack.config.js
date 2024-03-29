var path = require('path');
var vue = require('vue-loader');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var APP_TITLE = "vue seeds";
var PUBLIC_PATH="/";

module.exports = {
  entry: APP_PATH + '/main.js',
  output: {
    path: BUILD_PATH,
    publicPath: PUBLIC_PATH,
    filename: '[name].bundle.[hash].js',
  },
  resolve: {
    alias: {
      jquery: "jquery/src/jquery.js"
    }
  },
  module: {
    loaders: [{
        test: /\.vue$/,
        loader: 'vue'
      }, {
        test: /\.js$/,
        // excluding some local linked packages.
        // for normal use cases only node_modules is needed.
        exclude: /node_modules|vue\/src|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel'
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css"),
        include: APP_PATH
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass"),
        // loaders: ["style", "css", "sass"],
        include: APP_PATH
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      }, // inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.ttf$/,
        loader: "file?mimetype=application/octet-stream"
      }, {
        test: /\.eot$/,
        loader: "file"
      }, {
        test: /\.svg$/,
        loader: "file?mimetype=image/svg+xml"
      }, {
        test: /\.woff$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.woff2$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff2"
      }, {/*Fix Cannot read property 'match' of undefined error. see https://github.com/webpack/webpack/issues/1066 for details*/
        test: /jquery\/src\/selector\.js$/,
        loader: 'amd-define-factory-patcher-loader'
      }
    ]
  },
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract("css"),
      stylus: ExtractTextPlugin.extract("css!stylus")
    }
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  plugins: [new htmlWebpackPlugin({
      title: APP_TITLE,
      template: APP_PATH + '/index.html'
    }),
    new ExtractTextPlugin("[contenthash].css"),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  var productionPlugin = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ];
  if (module.exports.plugins) {
    module.exports.plugins = module.exports.plugins.concat(productionPlugin);
  } else {
    module.exports.plugins = productionPlugin;
  }
} else {
  module.exports.devtool = '#source-map'
}
