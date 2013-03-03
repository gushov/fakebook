var config = module.exports;

config["lilrouter node tests"] = {
  rootPath: "../",
  environment: "node",
  tests: [
    "test/*-test.js"
  ]
};

// config["lilrouter browser tests"] = {
//   rootPath: "../",
//   environment: "browser",
//   sources: [
//     "node_modules/es5-shim/es5-shim.js",
//     "dist/lilrouter.js"
//   ],
//   tests: [
//     "test/*-test.js"
//   ]
// };