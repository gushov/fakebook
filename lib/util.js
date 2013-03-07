/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var https = require('https');

module.exports = {

  next: function (methods, cb, ignoreErr) {

    var results = [];

    if (!methods) { return cb(); }

    function callMethod(i) {

      methods[i](function (err, result) {

        if (ignoreErr) {
          result = err;
          err = null;
        }

        results.push(result);

        if (err || i === methods.length - 1) {
          cb(err, results);
        } else {
          callMethod(i+1);
        }

      });

    }

    callMethod(0);

  },

  get: function (url, cb) {

    https.get(url, function(res) {

      res.setEncoding('utf8');
      res.on('data', cb);

    }).on('error', function(e) {
      console.error(e.message);
    });
  },

  contentType: function (url) {

    var fileType = url.slice(-4).replace('.', '');
    var type;

    switch (fileType) {
      case 'css':
        type = 'text/css';
        break;

      case 'jpg':
      case 'jpeg':
        type = 'image/jpeg';
        break;

      default:
        type = 'text/plain';
        break;
    }

    return type;

  },

  formParser: function (form) {

    var result = {};

    Object.keys(form).forEach(function (key) {

      var subKeys;

      if (key.indexOf('.') === -1) {
        result[key] = form[key];
      } else {

        subKeys = key.split('.');
        subKeys.unshift(result);
        subKeys.reduce(function (prev, curr, i, a) {

          if (!prev[curr]) {
            prev[curr] = i === a.length - 1 ? form[key] : {};
          }

          return prev[curr];

        });

      }

    });

    return result;

  },

  stache: function (data, view) {

    var vars = view.match(/\{\{#?\/?(?:\w|\.)*\}\}/gm);
    var frags = view.split(/(?:^\{\{#?\/?(?:\w|\.)*\}\}\n?)|(?:\{\{#?\/?(?:\w|\.)*\}\})/gm);
    var tokens = [];

    function parse(tokens, data) {

      var parsed = [];

      tokens.forEach(function (token, i) {

        var subTokens, subLength, subData, value;
        var stripped = token.indexOf('{{') === 0 ?
          token.slice(2, -2) : undefined;

        if (stripped && stripped.charAt(0) === '#') {

          subLength = tokens.indexOf(token.replace('#', '/')) - i - 1;
          subTokens = tokens.splice(i + 1, subLength);
          subData = data[stripped.slice(1)];
          subData = subData.length ? subData : [subData];
          subData.forEach(function (part) {
            parsed.push(parse(subTokens.slice(0), part).join(''));
          });

        } else if (stripped) {

          value = data;
          stripped.split('.').forEach(function (prop) {
            value = value[prop];
          });

          parsed.push(value);

        } else {
          parsed.push(token);
        }

      });

      return parsed;

    }

    frags.forEach(function (frag, i) {

      tokens.push(frag);
      tokens.push(vars.shift() || '');

    });

    return parse(tokens, data).join('');

  }

};