/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var logger = require('../lib/logger').init();
var Router = require('../lib/router');

buster.testCase("router", {

  "should read get and post routes": function () {

    var router = Router.init({}, logger);
    var get = this.spy();
    var post = this.spy();
    var middleware = router
      .get('/test', get)
      .post('/test', post)
      .middleware();

    middleware({ url: '/test', method: 'GET'}, {});
    middleware({ url: '/test', method: 'POST'}, {});

    assert.calledOnce(get);
    assert.calledOnce(post);

  },

  "should read static file": function () {

    var readFile = this.stub().callsArgWith(1, null, 'buffer');
    var writeHead = this.spy();
    var end = this.spy();
    var router = Router.init({ readFile: readFile }, logger);
    var middleware = router.middleware();

    middleware({
     url: '/test.css',
     method: 'GET' },
    {
     writeHead: writeHead,
     end: end
    });

    assert.calledOnce(readFile);
    assert.calledOnce(writeHead);
    assert.calledOnce(end);

  }

});
