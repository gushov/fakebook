/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var Logger = require('../lib/logger');

buster.testCase("logger", {

  "should call console": function () {

    var error = this.spy();
    var info = this.spy();
    var logger = Logger.init({
      error: error,
      info: info
    });

    logger.error('a', 1);
    logger.info('b', 2);

    assert.calledOnceWith(error, 'a', 1);
    assert.calledOnceWith(info, 'b', 2);

  }

});
