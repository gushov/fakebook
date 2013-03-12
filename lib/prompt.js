/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var events = require('events');
var util = require('util');
var next = require('./util').next;

/**
 * Creates an object to handle command prompt interaction
 * @param {Object} readline Readline interface
 */
function Prompt(readline) {

  events.EventEmitter.call(this);
  this.rl = readline;

}

util.inherits(Prompt, events.EventEmitter);

/**
 * Prompt Events
 */
Prompt.prototype.ev = {
  REQUEST_APP_DATA: 'REQUEST_APP_DATA',
  RECEIVE_APP_DATA: 'RECEIVE_APP_DATA'
};

/**
 * Gets app data from user
 * @emits RECEIVE_APP_DATA 
 */
Prompt.prototype.getAppData = function () {

  var self = this;

  next([
    this.rl.question.bind(this.rl, '>enter your app id: '),
    this.rl.question.bind(this.rl, '>enter your app token: '),
    this.rl.question.bind(this.rl, '>enter comma separated graph fields: ')
  ], function (err, results) {

    self.rl.close();

    self.emit(self.ev.RECEIVE_APP_DATA, {
      appId: results[0],
      appToken: results[1],
      fields: results[2]
    });

  }, true);

};

/**
 * Returns and instance of the prompt object
 * @param {Object} readline Readline interface
 * @returns {Object} Prompt instance
 */
exports.init = function (readline) {

  var prompt = new Prompt(readline);
  prompt.on(prompt.ev.REQUEST_APP_DATA, prompt.getAppData);
  return prompt;

};
