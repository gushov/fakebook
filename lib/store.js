/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

function Store() {
  this.mem = {};
}

Store.prototype.save = function (key, value, cb) {
  this.mem[key] = value;
  cb(null, value);
};

Store.prototype.fetch = function (key, cb) {
  cb(null, this.mem[key]);
};

Store.prototype.id = function () {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
};

var store = new Store();
module.exports = store;