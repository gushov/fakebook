/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var events = require('events');
var util = require('util');
var url = require('url');

/**
 * Creates object for fetching facebook data
 * @param {Function} get Http get function
 * @param {Object} logger Object
 */
function Fetcher(https, logger) {

  events.EventEmitter.call(this);
  this.https = https;
  this.logger = logger;

}

util.inherits(Fetcher, events.EventEmitter);

/**
 * Fetcher Events
 */
Fetcher.prototype.ev = {
  REQUEST_FB_DATA: 'REQUEST_FB_DATA',
  RECEIVE_FB_DATA: 'RECEIVE_FB_DATA'
};

/**
 * Wrapper for http get request
 * @param {String} url Url to get
 * @param {Function} cb Callback
 */
Fetcher.prototype.get = function (url, cb) {

  var self = this;

  this.https.get(url, function(res) {

    res.setEncoding('utf8');
    res.on('data', cb);

  }).on('error', function(e) {
    self.logger.error(e.message);
  });

};

/**
 * Fetch all test users
 * @param {String} fields Comma separated string of user fields
 * @param {Array} users Array of user objects
 * @emits RECEIEVE_FB_DATA
 */
Fetcher.prototype.getTestUsers = function (fields, users) {

  var self = this;
  var userUrl = {
    protocol: 'https',
    host: 'graph.facebook.com'
  };
  var jobs = {};
  var parsed = [];

  function done(d) {

    var user = JSON.parse(d);
    parsed.push(user);
    delete jobs[user.id];

    self.logger.info('-fetched', user.id, user.name);

    if (Object.keys(jobs).length === 0) {
      self.emit(self.ev.RECEIVE_FB_DATA, parsed);
    }

  }

  users.forEach(function (user) {

    jobs[user.id] = false;
    userUrl.pathname = user.id;
    userUrl.search = 'fields=' + fields +
      '&access_token=' + user.access_token;

    self.get(url.format(userUrl), done);

  });

};

/**
 * Fetch list of authenticated FB test users
 * @param {Object} conf App configuration object
 */
Fetcher.prototype.getTestUserList = function (conf) {

  var self = this;
  var listUrl = {
    protocol: 'https',
    host: 'graph.facebook.com',
    pathname:  conf.appId + '/accounts/test-users',
    search: 'access_token=' + conf.appToken
  };

  this.get(url.format(listUrl), function (d) {

    var testUsers = JSON.parse(d).data;
    var authUsers = [];

    testUsers.forEach(function (testUser) {

      if (testUser.access_token) {
        authUsers.push(testUser);
      }

    });

    self.logger.info('-found', authUsers.length, 'authenticated users');
    self.getTestUsers(conf.fields, authUsers);

  });

};

/**
 * Returns and instance of the fetcher object
 * @param {Function} get Http get function
 * @param {Object} logger Logger object
 * @returns {Object} Fetcher instance
 */
exports.init = function (get, logger) {

  var fetcher = new Fetcher(get, logger);
  fetcher.on(fetcher.ev.REQUEST_FB_DATA, fetcher.getTestUserList);

  return fetcher;

};