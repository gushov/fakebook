/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var http = require('http');
var prompt = require('./lib/prompt');
var fetcher = require('./lib/fetcher');
var config = require('./lib/config');
var router = require('./lib/router');
var routes = require('./routes');

exports.init = function (host, port) {

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
      console.log('-fakebook up on ' + host + ':' + port);
    });

  });

  config.on(config.ev.MISSING_CONFIG, function () {
    prompt.emit(prompt.ev.REQUEST_APP_DATA);
  });

  config.emit(config.ev.LOAD_CONFIG);

};
