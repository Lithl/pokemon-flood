const path = require('path');

module.exports = {
  entry: {
    flood: './src/components/flood-app/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {minimize: true},
        }],
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {transpileOnly: true},
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'polymer-css-loader',
            options: {minify: true},
          },
          'extract-loader',
          'css-loader',
          'sass-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {splitChunks: {chunks: 'all'}},
  performance: {hints: false},
};
