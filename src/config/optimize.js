const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const optimizeConfig = () => {
  return {
    devtool: false,

    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new UglifyJsPlugin()
    ]
  };
};

module.exports = optimizeConfig;
