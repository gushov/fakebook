/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var events = require('events');
var util = require('util');
var readline = require('readline');
var next = require('./util').next;

function Prompt() {
  events.EventEmitter.call(this);
}

util.inherits(Prompt, events.EventEmitter);

Prompt.prototype.ev = {
  REQUEST_APP_DATA: 'REQUEST_APP_DATA',
  RECEIVE_APP_DATA: 'RECEIVE_APP_DATA'
};

Prompt.prototype.getAppData = function () {

  var self = this;

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  next([
    rl.question.bind(rl, '>enter your app id: '),
    rl.question.bind(rl, '>enter your app token: '),
    rl.question.bind(rl, '>enter comma separated graph fields: ')
  ], function (err, results) {

    rl.close();
    
    self.emit(self.ev.RECEIVE_APP_DATA, {
      appId: results[0],
      appToken: results[1],
      fields: results[2],
      port: results[3],
      redirect: results[4]
    });

  }, true);

};

var prompt = new Prompt();
prompt.on(prompt.ev.REQUEST_APP_DATA, prompt.getAppData);
module.exports = prompt;
