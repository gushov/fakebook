/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var Store = require('../lib/store');

buster.testCase("store", {

  "should store and fetch and object": function (done) {

    var store = Store.init();
    var id = store.id();

    store.save(id, { apple: 'cart' }, function () {
      store.fetch(id, function (err, value) {
        assert.equals(value, { apple: 'cart' });
        done();
      });
    });

  },

  "should return unique id's": function () {

    var store = Store.init();
    var fatherId = store.id();
    var motherId = store.id();

    assert.equals(typeof fatherId, 'string');
    assert.equals(typeof motherId, 'string');
    refute.equals(fatherId, motherId);

  }

});
