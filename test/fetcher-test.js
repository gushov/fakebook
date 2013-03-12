/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var logger = require('../lib/logger').init();
var Fetcher = require('../lib/fetcher');

buster.testCase("fetcher", {

  "should emit receive data event": function (done) {

    var setEncoding = this.spy();

    var onData = this.stub()
      .callsArgWith(1, '{ "data": [{ "access_token": 1 }] }')
      .callsArgWith(1, '{ "name": "bill" } ');

    var onError = this.spy();

    var get = this.stub()
      .callsArgWith(1, { setEncoding: setEncoding, on: onData })
      .returns({ on: onError });

    var fetcher = Fetcher.init({ get: get }, logger);

    fetcher.once(fetcher.ev.RECEIVE_FB_DATA, function (users) {
      assert.equals(users, [{ name: 'bill' }]);
      done();
    });

    fetcher.emit(fetcher.ev.REQUEST_FB_DATA, {});

  }

});
