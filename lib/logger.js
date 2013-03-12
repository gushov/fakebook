/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

/**
 * Creates a wrapper for the console
 * @constructor
 * @param {Object} console Console object
 */
function Logger(console) {

  this.console = console || {
    error: function () {},
    info: function () {}
  };

}

/**
 * Log Error
 */
Logger.prototype.error = function () {
  this.console.error.apply(this.console, arguments);
};

/**
 * Log info
 */
Logger.prototype.info = function () {
  this.console.info.apply(this.console, arguments);
};

/**
 * Returns and instance of the logger object
 * @param {Object} console Console object
 * @returns {Object} Logger instance
 */
exports.init = function (console) {

  var logger = new Logger(console);
  return logger;

};