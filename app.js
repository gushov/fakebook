/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var http = require('http');
var https = require('https');
var fs = require('fs');
var readline = require('readline');

var Config = require('./lib/config');
var Fetcher = require('./lib/fetcher');
var Logger = require('./lib/logger');
var Prompt = require('./lib/prompt');
var Router = require('./lib/router');
var routes = require('./routes');

/**
 * Init fakebook server
 * @param {String} host Hostname to run server on
 * @param {Number} port Port number to run server on
 */
exports.init = function (host, port) {

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var logger = Logger.init(console);
  var config = Config.init(fs, logger);
  var fetcher = Fetcher.init(https, logger);
  var prompt = Prompt.init(rl);
  var router = Router.init(fs, logger);

  fetcher.on(fetcher.ev.RECEIVE_FB_DATA, function (data) {
    config.emit(config.ev.SAVE_CONFIG, data);
  });

  prompt.on(prompt.ev.RECEIVE_APP_DATA, function (data) {
    fetcher.emit(fetcher.ev.REQUEST_FB_DATA, data);
  });

  config.on(config.ev.FOUND_CONFIG, function (conf) {

    var server = http.createServer(router
      .get('/dialog/oauth', routes.dialog)
      .get('/oauth/access_token', routes.token)
      .get('/me', routes.me)
      .post('/config', routes.config)
      .middleware());

    server.listen(port, host, function () {
      logger.info('-fakebook up on ' + host + ':' + port);
    });

  });

  config.on(config.ev.MISSING_CONFIG, function () {
    prompt.emit(prompt.ev.REQUEST_APP_DATA);
  });

  config.emit(config.ev.LOAD_CONFIG);

};
