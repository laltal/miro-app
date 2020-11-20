const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',

  entry: {
    index: './src/index.js', // Example! It works with React.
    library: './src/library.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(le|c)ss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./src'), path.resolve('./node_modules')],
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      LIBRARY_URL: process.env.NODE_ENV === "production" ? "'/miro-app/library.html'" : "'../library.html'" ,
      QUERY_JSON: process.env.NODE_ENV === "production" ? "'/miro-app/query.json'" : "'query.json'" ,
    })
  ]
}
