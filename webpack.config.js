const path = require("path");
const srcPath = path.resolve(__dirname, "src");
const distPath = path.resolve(__dirname, "build");

module.exports = {
  target: "web",
  context: srcPath,
  entry: "./index.js",
  output: {
    path: distPath,
    filename: "graphiql.js",
    publicPath: "/"
  },
  resolve: {
    modules: ["node_modules", "src"],
    extensions: ["*", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader"
      }
    ]
  }
};
