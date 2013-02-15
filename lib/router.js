/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, node:true */

function Router() {

  this.routes = {
    GET: {}
  };

}

Router.prototype.get = function (path, handler) {
  this.routes.GET[path] = handler; 
};

Router.prototype.handler = function (req, res) {

  var routes = this.routes[req.method] || {};
  var handler = routes[req.url];

  if (handler) {
    handler(req, res);
  } else {
    console.log('no hanlder for', req.url);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('fakebook doesn\'t know how to ' + req.url);
    res.end();
  }

};

var router = new Router();

module.exports = router;
