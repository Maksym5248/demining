import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";
import TerserPlugin from "terser-webpack-plugin";
import Dotenv from "dotenv-webpack";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

function inDev() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
}

const rules = [
  {
    test: /\.([cm]?ts|tsx)$/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
        logLevel: "debug"
      }
    },
    exclude: /node_modules/,
  },
];

const config = {
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    path: path.resolve("dist"),
    filename: "index.js",
    publicPath: "/",
  },
  devtool: "inline-source-map",
  target: "node",
  externals: [nodeExternals({
    allowlist: ["shared"]
  })],
  mode: inDev() ? "development" : "production",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new Dotenv(),
  ],
  module: {
    rules,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        keep_classnames: true,
        keep_fnames: true,
      },
    })],
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({ extensions: [".ts", ".tsx", ".js"] }),
    ],
    extensions: [".ts", ".tsx", ".js"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"]
    },
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
// eslint-disable-next-line import/no-default-export
export default config;
