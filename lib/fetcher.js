/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

var events = require('events');
var util = require('util');
var url = require('url');
var get = require('./util').get;

function Fetcher() {
  events.EventEmitter.call(this);
}

util.inherits(Fetcher, events.EventEmitter);

Fetcher.prototype.ev = {
  REQUEST_FB_DATA: 'REQUEST_FB_DATA',
  RECEIVE_FB_DATA: 'RECEIVE_FB_DATA'
};

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

    console.log('-fetched', user.id, user.name);

    if (Object.keys(jobs).length === 0) {
      self.emit(self.ev.RECEIVE_FB_DATA, parsed);
    }

  }

  users.forEach(function (user) {

    jobs[user.id] = false;
    userUrl.pathname = user.id;
    userUrl.search = 'fields=' + fields + 
      '&access_token=' + user.access_token;

    get(url.format(userUrl), done);

  });

};

Fetcher.prototype.getFbData = function (data) {

  var self = this;
  var listUrl = {
    protocol: 'https',
    host: 'graph.facebook.com',
    pathname:  data.appId + '/accounts/test-users',
    search: 'access_token=' + data.appToken
  };

  get(url.format(listUrl), function (d) {

    var testUsers = JSON.parse(d).data;
    var authUsers = [];

    testUsers.forEach(function (testUser) {

      if (testUser.access_token) {
        authUsers.push(testUser);
      }

    });

    console.log('-found', authUsers.length, 'authenticated users');

    self.getTestUsers(data.fields, authUsers);

  });
  
};

var fetcher = new Fetcher();
fetcher.on(fetcher.ev.REQUEST_FB_DATA, fetcher.getFbData);
module.exports = fetcher; 