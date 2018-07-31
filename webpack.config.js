const path = require('path');

module.exports = {
  entry: {
    index: './src/mapviewpage/index.js',
    settings: './src/settingspage/settings.js'
  },
  output: {
    filename: '[name].js',
    //path: path.resolve('C:/users/blahblahblah/projects/central_server/console/static/console') //this is for writing to a specific destination
    //path: path.resolve(__dirname, 'dist') <-old single page config
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      { test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader" },
      { test: /\.(png|svg|jpg|gif)$/,
      use: [
          'file-loader'
      ]},
      { test: /\.css$/,
      use: [
          {
              loader: 'style-loader'
          },
          {
              loader: 'css-loader'
          },
          {
              loader: 'sass-loader'
          }
      ]},
      { test: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
          {
              loader: 'file-loader'
          },
      ]

      }
    ]
  }
};
