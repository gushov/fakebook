/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var path = require('path');
var url = require('url');
var util = require('./util');

/**
 * Create object to handle http routes
 * @param {Object} fs File system object
 * @param {Object} logger Logger object
 */
function Router(fs, logger) {

  this.routes = {
    GET: {},
    POST: {}
  };
  this.fs = fs;
  this.logger = logger;

}

/**
 * Creates an http get route
 * @param {String} path Route path
 * @param {Function} handler Route handler function
 * @return {Object} Router instance 
 */
Router.prototype.get = function (path, handler) {
  this.routes.GET[path] = handler;
  return this;
};

/**
 * Creates an http post route
 * @param {String} path Route path
 * @param {Function} handler Route handler function
 * @return {Object} Router instance 
 */
Router.prototype.post = function (path, handler) {
  this.routes.POST[path] = handler;
  return this;
};

/**
 * Error handler
 * @param {Object} error Error object
 * @param {Object} req Http request
 * @param {Object} res Http response
 */
Router.prototype.error = function (error, req, res) {

  this.logger.error(error.message, req.url);
  res.writeHead(error.status, { 'Content-Type': 'text/plain' });
  res.write(error.message + ' ' + req.url);
  res.end();

};

/**
 * Static file handler
 * @param {String} pathname Path to the file
 * @param {Object} req Http request
 * @param {Object} res Http response
 */
Router.prototype.static = function (pathname, req, res) {

  var self = this;

  this.fs.readFile(path.join(__dirname, '../public', pathname), function (err, buf) {

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

};

/**
 * Returns router middleware
 * @return {Function} Router middleware
 */
Router.prototype.middleware = function () {

  var self = this;

  return function (req, res) {

    var pathname = url.parse(req.url).pathname;
    var routes = self.routes[req.method] || {};
    var handler = routes[pathname];

    if (handler) {

      self.logger.info('-' + req.method, decodeURIComponent(req.url.replace(/\+/g, ' ')));
      handler(req, res);

    } else {
      self.static(pathname, req, res);
    }

  };

};

/**
 * Returns and instance of the router object
 * @param {Object} fs File system object
 * @param {Object} logger Logger object
 * @returns {Object} Router instance
 */
exports.init = function (fs, logger) {

  var router = new Router(fs, logger);
  return router;

};