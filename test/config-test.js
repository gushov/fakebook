/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var logger = require('../lib/logger').init();
var Config = require('../lib/config');

buster.testCase("config", {

  "should emit missing config event": function (done) {

    var readFile = this.stub().callsArgWith(2, {});
    var config = Config.init({ readFile: readFile }, logger);

    config.once(config.ev.MISSING_CONFIG, function () {
      assert(true);
      done();
    });

    config.emit(config.ev.LOAD_CONFIG);

  },

  "should emit found config event": function (done) {

    var readFile = this.stub().callsArgWith(2, null, '{ "a": 1 }');
    var config = Config.init({ readFile: readFile }, logger);

    config.once(config.ev.FOUND_CONFIG, function (data) {
      assert.equals(data, { a: 1 });
      done();
    });

    config.emit(config.ev.LOAD_CONFIG);

  },

  "should write config file": function (done) {

    var writeFile = this.stub().callsArgWith(2, null);
    var config = Config.init({ writeFile: writeFile }, logger);

    config.once(config.ev.FOUND_CONFIG, function (data) {
      assert.equals(data, '{\n  "a": 1\n}');
      assert.calledOnce(writeFile);
      done();
    });

    config.emit(config.ev.SAVE_CONFIG, { a: 1 });

  }

});
