/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var url = require('url');
var qs = require('querystring');
var util = require('./util');

/**
 * Init the routes object
 * @param {Object} fs File system object
 * @return {Object} Routes object
 */
exports.init = function (fs, store) {

  return {

    /**
     * Parse and store user then redirect
     * @param {Object} req Request object
     * @param {Object} res Response object
     */
    user: function (req, res) {

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

    },

    /**
     * Render the user selection dialog
     * @param {Object} req Request object
     * @param {Object} res Response object
     */
    dialog: function (req, res) {

      var query = url.parse(req.url).query;
      var queryObj = qs.parse(query);
      var templatePath = __dirname + '/../views/index.stache';
      var usersPath = __dirname + '/../users.json';

      util.next([
        fs.readFile.bind(fs, templatePath, 'utf8'),
        fs.readFile.bind(fs, usersPath, 'utf8')
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

    },

    /**
     * Respond with token json
     * @param {Object} req Request object
     * @param {Object} res Response object
     */
    token: function (req, res) {

      var query = url.parse(req.url).query;
      var queryObj = qs.parse(query);

      var body = qs.stringify({ access_token: queryObj.code });

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      });

      res.end(body);

    },

    /**
     * Respond with user json
     * @param {Object} req Request object
     * @param {Object} res Response object
     */
    me: function (req, res) {

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

    }

  };

};
