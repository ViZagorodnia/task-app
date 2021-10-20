const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
   entry: './src/app.js',
   output: {
      filename: 'bundle.[chunkhash].js',
      path: path.resolve(__dirname, 'public')
   },
   devServer: {
      port: 3000
   },
   plugins: [
      new HTMLPlugin({
         template: './src/index.html'
      }),
      new CleanWebpackPlugin(),
      new Dotenv()
   ],
   module: {
      rules: [
         {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
         },
      ],
   },
}