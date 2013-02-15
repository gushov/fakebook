/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var https = require('https');

module.exports = {

  next: function (methods, cb) {

    var results = [];

    if (!methods) { return cb(); }

    function callMethod(i) {

      methods[i](function (result) {

        results.push(result);

        if (i === methods.length - 1) {
          cb(results);
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
  }

};