/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var Prompt = require('../lib/prompt');

buster.testCase("prompt", {

  "should call console": function (done) {

    var question = this.stub()
      .callsArgWith(1, 'appId')
      .callsArgWith(1, 'appToken')
      .callsArgWith(1, 'la,la,la');
    var close = this.spy();
    var prompt = Prompt.init({ question: question, close: close });

    prompt.once(prompt.ev.RECEIVE_APP_DATA, function (appData) {

      assert.equals(appData, {
        appId: 'appId',
        appToken: 'appToken',
        fields: 'la,la,la'
      });
      assert.calledThrice(question);
      assert.calledOnce(close);
      done();

    });

    prompt.emit(prompt.ev.REQUEST_APP_DATA);

  }

});
