/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var url = require('url');
var qs = require('querystring');
var fs = require('fs');
var util = require('../lib/util');
var store = require('../lib/store');

exports.config = function (req, res) {

  var body = '';

  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {

    var form = qs.parse(body);
    var user = util.formParser(form);
    var code = store.id();
    var querystring = qs.stringify({
      code: code,
      state: user.state
    });

    store.save(code, user, function (err) {

      res.writeHead(302, {
        'Location': user.redirect_uri + '?' + querystring
      });

      res.end();

    });

  });

};

exports.dialog = function (req, res) {

  var query = url.parse(req.url).query;
  var queryObj = qs.parse(query);
  var templatePath = __dirname + '/../views/index.stache';
  var configPath = __dirname + '/../config.json';

  util.next([
    fs.readFile.bind(fs, templatePath, 'utf8'),
    fs.readFile.bind(fs, configPath, 'utf8')
  ], function (err, results) {

    var buf = results[0];
    var users = JSON.parse(results[1]).map(function (user) {
      user.query = queryObj;
      return user;
    });
    var parsed = util.stache({ users: users }, buf);

    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Length': parsed.length
    });

    res.end(parsed);

  });

};

exports.token = function (req, res) {

  var query = url.parse(req.url).query;
  var queryObj = qs.parse(query);

  var body = qs.stringify({ access_token: queryObj.code });

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': body.length
  });

  res.end(body);

};

exports.me = function (req, res) {

  var query = url.parse(req.url).query;
  var queryObj = qs.parse(query);

  store.fetch(queryObj.access_token, function (err, user) {

    var body = JSON.stringify(user);

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    });

    res.end(body);

  });

};
