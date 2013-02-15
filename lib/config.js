/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var fs = require('fs');
var events = require('events');
var util = require('util');

function Config() {
  events.EventEmitter.call(this);
}

util.inherits(Config, events.EventEmitter);

Config.prototype.ev = {
  LOAD_CONFIG: 'LOAD_CONFIG',
  FOUND_CONFIG: 'FOUND_CONFIG',
  MISSING_CONFIG: 'MISSING_CONFIG',
  SAVE_CONFIG: 'SAVE_CONFIG'
};

Config.prototype.loadJson = function () {

  var self = this;

  fs.readFile('./config.json', 'utf8', function (err, data) {

    if (err) {
      console.log('-no config file found');
      self.emit(self.ev.MISSING_CONFIG);
    } else {
      console.log('-found config file');
      self.emit(self.ev.FOUND_CONFIG, JSON.parse(data));
    }

  });

};

Config.prototype.saveJson = function (config) {

  var self = this;
  var data = JSON.stringify(config, null, 2);

  fs.writeFile('./config.json', data, function (err) {

    if (err) { return console.error(err); }
    console.log('-saving config file');
    self.emit(self.ev.FOUND_CONFIG, data);

  });
};

var config = new Config();
config.on(config.ev.LOAD_CONFIG, config.loadJson);
config.on(config.ev.SAVE_CONFIG, config.saveJson);
module.exports = config; 