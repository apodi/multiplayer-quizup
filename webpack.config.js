const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require("glob")
//const outputDirectory = "dist";


const extractPlugin = new ExtractTextPlugin({
  filename: './public/assets/css/app.css'
});

const config = {
  mode: 'development',
  entry: __dirname + "/app.js",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, './public/dist'),
    filename: './public/assets/js/bundle.js'
  },
  module: {
    rules: [
      // eslint loader
      // {
      //   enforce: "pre",
      //   test: /\.js?$/,
      //   exclude: [/node_modules/],
      //   loader: "eslint-loader",
      //   options: {
      //     fix: true,
      //   },
      // },
      //babel-loader
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "public"),
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "config"),
          path.resolve(__dirname, "routes")
        ],
        exclude: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "public/dist"),
          path.resolve(__dirname, "public/assets")
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env', 'stage-2', 'es2015']
          }
        }
      },
      //html-loader
      { test: /\.html$/, 
        use: ['html-loader'] 
      },
      //sass-loader
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, 'public', 'assets', 'scss'),
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'bootstrap/scss')
        ],
        use: extractPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      //file-loader(for images)
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?sourceMap"
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml"
      },

      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './public/assets/media/imgs'
            }
          }
        ]
      },
      //file-loader(for fonts)
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["./public/dist"]),  //new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: "app.html"
    }),
    extractPlugin,
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.$": "jquery",
      "window.jQuery": "jquery",
      Waves: "node-waves",
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "./public/dist/assets/media"),
    compress: true,
    port: 12000,
    stats: "errors-only",
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        secure: false,
        changeOrigin: true,
      }
    }
  },

}

module.exports = config;
