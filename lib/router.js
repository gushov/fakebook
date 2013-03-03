/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var fs = require('fs');
var path = require('path');
var util = require('./util');

function Router() {

  this.routes = {
    GET: {},
    POST: {}
  };

}

Router.prototype.get = function (path, handler) {
  this.routes.GET[path] = handler;
  return this;
};

Router.prototype.post = function (path, handler) {
  this.routes.POST[path] = handler;
  return this;
};

Router.prototype.error = function (error, req, res) {

  console.log(error.message, req.url);
  res.writeHead(error.status, { 'Content-Type': 'text/plain' });
  res.write(error.message + ' ' + req.url);
  res.end();

};

Router.prototype.middleware = function () {

  var self = this;

  return function (req, res) {

    var routes = self.routes[req.method] || {};
    var handler = routes[req.url];

    if (handler) {
      handler(req, res);
    } else {

      fs.readFile(path.join(__dirname, '../public', req.url), function (err, buf) {

        var contentType;

        if (err) {
          return self.error({
            status: 400,
            message: 'fakebook doesn\'t know how to:'
          }, req, res);
        }

        res.writeHead(200, {
          'Content-Type': util.contentType(req.url),
          'Content-Length': buf.length
        });

        res.end(buf);

      });

    }

  };

};

var router = new Router();

module.exports = router;
