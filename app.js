/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var http = require('http');
var https = require('https');
var fs = require('fs');
var readline = require('readline');

var Users = require('./lib/users');
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
  var users = Users.init(fs, logger);
  var fetcher = Fetcher.init(https, logger);
  var prompt = Prompt.init(rl);
  var router = Router.init(fs, logger);

  fetcher.on(fetcher.ev.RECEIVE_FB_DATA, function (data) {
    users.emit(users.ev.SAVE_USERS, data);
  });

  prompt.on(prompt.ev.RECEIVE_APP_DATA, function (data) {
    fetcher.emit(fetcher.ev.REQUEST_FB_DATA, data);
  });

  users.on(users.ev.FOUND_USERS, function (conf) {

    var server = http.createServer(router
      .get('/dialog/oauth', routes.dialog)
      .get('/oauth/access_token', routes.token)
      .get('/me', routes.me)
      .post('/user', routes.user)
      .middleware());

    server.listen(port, host, function () {
      logger.info('-fakebook up on ' + host + ':' + port);
    });

  });

  users.on(users.ev.MISSING_USERS, function () {
    prompt.emit(prompt.ev.REQUEST_APP_DATA);
  });

  users.emit(users.ev.LOAD_USERS);

};
