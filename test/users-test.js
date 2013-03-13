/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var logger = require('../lib/logger').init();
var Users = require('../lib/users');

buster.testCase("users", {

  "should emit missing users event": function (done) {

    var readFile = this.stub().callsArgWith(2, {});
    var users = Users.init({ readFile: readFile }, logger);

    users.once(users.ev.MISSING_USERS, function () {
      assert(true);
      done();
    });

    users.emit(users.ev.LOAD_USERS);

  },

  "should emit found users event": function (done) {

    var readFile = this.stub().callsArgWith(2, null, '{ "a": 1 }');
    var users = Users.init({ readFile: readFile }, logger);

    users.once(users.ev.FOUND_USERS, function (data) {
      assert.equals(data, { a: 1 });
      done();
    });

    users.emit(users.ev.LOAD_USERS);

  },

  "should write users file": function (done) {

    var writeFile = this.stub().callsArgWith(2, null);
    var users = Users.init({ writeFile: writeFile }, logger);

    users.once(users.ev.FOUND_USERS, function (data) {
      assert.equals(data, '{\n  "a": 1\n}');
      assert.calledOnce(writeFile);
      done();
    });

    users.emit(users.ev.SAVE_USERS, { a: 1 });

  }

});
