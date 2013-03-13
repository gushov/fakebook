/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var events = require('events');
var util = require('util');
var path = require('path');

/**
 * Creates a configuration file handler
 * @constructor
 * @param {Object} fs File system object
 * @param {Object} logger Logger object
 */
function Config(fs, logger) {

  events.EventEmitter.call(this);
  this.fs = fs;
  this.logger = logger;

}

util.inherits(Config, events.EventEmitter);

/**
 * Config Events
 */
Config.prototype.ev = {
  LOAD_CONFIG: 'LOAD_CONFIG',
  FOUND_CONFIG: 'FOUND_CONFIG',
  MISSING_CONFIG: 'MISSING_CONFIG',
  SAVE_CONFIG: 'SAVE_CONFIG'
};

/**
 * Load saved JSON file
 * @emits MISSING_CONFIG, FOUND_CONFIG
 */
Config.prototype.loadConfig = function () {

  var self = this;
  var configPath = path.join(__dirname, '../config.json');

  this.fs.readFile(configPath, 'utf8', function (err, data) {

    if (err) {
      self.logger.error('-no config file found');
      return self.emit(self.ev.MISSING_CONFIG);
    }

    self.logger.info('-found config file');
    self.emit(self.ev.FOUND_CONFIG, JSON.parse(data));

  });

};

/**
 * Saves config to JSON file
 * @param {Object} config Configuration object
 * @emits FOUND_CONFIG
 */
Config.prototype.saveConfig = function (config) {

  var self = this;
  var data = JSON.stringify(config, null, 2);
  var configPath = path.join(__dirname, '../config.json');

  this.fs.writeFile(configPath, data, function (err) {

    if (err) {
      return self.logger.error(err);
    }

    self.logger.info('-saving config file');
    self.emit(self.ev.FOUND_CONFIG, data);

  });

};

/**
 * Returns an instance of the config object
 * @param {Object} fs File system object
 * @param {Object} logger Logger object
 * @returns {Object} Config instance
 */
exports.init = function (fs, logger) {

  var config = new Config(fs, logger);

  config.on(config.ev.LOAD_CONFIG, config.loadConfig);
  config.on(config.ev.SAVE_CONFIG, config.saveConfig);

  return config;

};