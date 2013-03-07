/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var fs = require('fs');
var path = require('path');
var url = require('url');
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

  console.error(error.message, req.url);
  res.writeHead(error.status, { 'Content-Type': 'text/plain' });
  res.write(error.message + ' ' + req.url);
  res.end();

};

Router.prototype.middleware = function () {

  var self = this;

  return function (req, res) {

    var pathname = url.parse(req.url).pathname;
    var routes = self.routes[req.method] || {};
    var handler = routes[pathname];

    if (handler) {

      console.log('-' + req.method, decodeURIComponent(req.url.replace(/\+/g, ' ')));
      handler(req, res);

    } else {

      fs.readFile(path.join(__dirname, '../public', pathname), function (err, buf) {

        var contentType;

        if (err) {
          return self.error({
            status: 400,
            message: 'fakebook doesn\'t know how to:'
          }, req, res);
        }

        res.writeHead(200, {
          'Content-Type': util.contentType(pathname),
          'Content-Length': buf.length
        });

        res.end(buf);

      });

    }

  };

};

var router = new Router();

module.exports = router;
