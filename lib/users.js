/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var events = require('events');
var util = require('util');
var path = require('path');

/**
 * Creates a users file handler
 * @constructor
 * @param {Object} fs File system object
 * @param {Object} logger Logger object
 */
function Users(fs, logger) {

  events.EventEmitter.call(this);
  this.fs = fs;
  this.logger = logger;

}

util.inherits(Users, events.EventEmitter);

/**
 * Users Events
 */
Users.prototype.ev = {
  LOAD_USERS: 'LOAD_USERS',
  FOUND_USERS: 'FOUND_USERS',
  MISSING_USERS: 'MISSING_USERS',
  SAVE_USERS: 'SAVE_USERS'
};

/**
 * Load saved JSON file
 * @emits MISSING_USERS, FOUND_USERS
 */
Users.prototype.loadUsers = function () {

  var self = this;
  var usersPath = path.join(__dirname, '../users.json');

  this.fs.readFile(usersPath, 'utf8', function (err, data) {

    if (err) {
      self.logger.error('-no users file found');
      return self.emit(self.ev.MISSING_USERS);
    }

    self.logger.info('-found users file');
    self.emit(self.ev.FOUND_USERS, JSON.parse(data));

  });

};

/**
 * Saves users to JSON file
 * @param {Object} users User data object
 * @emits FOUND_USERS
 */
Users.prototype.saveUsers = function (users) {

  var self = this;
  var data = JSON.stringify(users, null, 2);
  var usersPath = path.join(__dirname, '../users.json');

  this.fs.writeFile(usersPath, data, function (err) {

    if (err) {
      return self.logger.error(err);
    }

    self.logger.info('-saving users file');
    self.emit(self.ev.FOUND_USERS, data);

  });

};

/**
 * Returns an instance of the users object
 * @param {Object} fs File system object
 * @param {Object} logger Logger object
 * @returns {Object} Users instance
 */
exports.init = function (fs, logger) {

  var users = new Users(fs, logger);

  users.on(users.ev.LOAD_USERS, users.loadUsers);
  users.on(users.ev.SAVE_USERS, users.saveUsers);

  return users;

};