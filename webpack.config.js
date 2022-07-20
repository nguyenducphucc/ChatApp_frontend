const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

const config = () => {
  //const backend_url = argv.mode === "production" ? :

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "main.js",
      publicPath: "/",
    },
    devServer: {
      static: path.resolve(__dirname, "build"),
      compress: true,
      port: 3000,
      proxy: {
        "/": {
          target: "http://localhost:3001",
        },
      },
      historyApiFallback: true,
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: "url-loader",
            },
          ],
        },
        {
          test: /\.(webm|mp4)$/,
          loader: "file-loader",
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify("test"),
      }),
      new Dotenv(),
    ],
  };
};

module.exports = config;
