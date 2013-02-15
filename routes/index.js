/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var qs = require('qs');
var fs = require('fs');

exports.favicon = function (req, res) {

  var path = __dirname + '/../public/favicon.ico';
  fs.readFile(path, function(err, buf){

    res.writeHead(200, {
      'Content-Type': 'image/x-icon',
      'Content-Length': buf.length
    });

    res.end(buf);

  });
   
};

exports.oauth = function(req, res){
  res.redirect('http://local.littlebrewery.com:3000/oauth?code=1122eeff&state=' + req.query.state);
};

exports.token = function(req, res){
  res.send(qs.stringify({ access_token: '3wewe33ee' }));
};

exports.me = function(req, res){

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
