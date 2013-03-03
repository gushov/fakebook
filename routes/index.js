/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var qs = require('querystring');
var fs = require('fs');
var util = require('../lib/util');

exports.dialog = function (req, res) {

  var templatePath = __dirname + '/../views/index.stache';
  var configPath = __dirname + '/../config.json';

  util.next([
    fs.readFile.bind(fs, templatePath, 'utf8'),
    fs.readFile.bind(fs, configPath, 'utf8')
  ], function (err, results) {

    var buf = results[0];
    var users = JSON.parse(results[1]);
    var parsed = util.stache({ users: users }, buf);

    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Length': parsed.length
    });

    res.end(parsed);

  });

};

exports.oauth = function (req, res) {
  res.redirect('http://local.littlebrewery.com:3000/oauth?code=1122eeff&state=' + req.query.state);
};

exports.token = function (req, res) {
  res.send(qs.stringify({ access_token: '3wewe33ee' }));
};

exports.me = function (req, res) {

  var fbUser = {
    id: "520851908",
    locale: "en_US",
    location: {
      name: "Berlin, Germany"
    },
    picture: {
      data: {
        url: "http://profile.ak.fbcdn.net/hprofile-ak-prn1/49064_520851908_4974_q.jpg"
      }
    },
    name: "Gus Hovland",
    email: "gushov@gmail.com"
  };

  res.send(JSON.stringify(fbUser));

};
