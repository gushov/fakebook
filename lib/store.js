/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

/**
 * Create an object to handle in memory key value store
 * @constructor
 */
function Store() {
  this.mem = {};
}

/**
 * Save an object
 * @param {String} key Storage key
 * @param {Object} value Storage value
 * @param {Function} cb Callback
 */
Store.prototype.save = function (key, value, cb) {
  this.mem[key] = value;
  cb(null, value);
};

/**
 * Fetch an object for given key
 * @param {String} key Storage key
 * @param {Function} cb Callback
 */
Store.prototype.fetch = function (key, cb) {
  cb(null, this.mem[key]);
};

/**
 * Return a unique-ish id
 * @return {String} Timestamp concated with random number
 */
Store.prototype.id = function () {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
};

/**
 * Returns an instance of the store object
 * @returns {Object} Store instance
 */
exports.init = function () {

  var store = new Store();
  return store;

};