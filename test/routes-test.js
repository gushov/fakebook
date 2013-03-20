/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var Routes = require('../lib/routes');

buster.testCase("routes", {

  "should handle user post route": function () {

    var save = this.stub().callsArg(2);
    var id = this.stub().returns('fakeid');
    var routes = Routes.init({}, { save: save, id: id });
    var on = this.stub()
      .callsArgWith(1, 'state=fakestate&name=iver')
      .callsArg(1);
    var writeHead = this.spy();
    var end = this.spy();

    routes.user({ on: on }, { writeHead: writeHead, end: end });

    assert.calledOnceWith(save, 'fakeid', {
      state: 'fakestate',
      name: 'iver'
    });

  } ,

  "should render user dialog": function () {

    var readFile = this.stub()
      .callsArgWith(2, null, '{{#users}}<b>{{name}}</b>{{/users}}')
      .callsArgWith(2, null, '[{ "name": "iver" }]');

    var routes = Routes.init({ readFile: readFile }, {});
    var writeHead = this.spy();
    var end = this.spy();

    routes.dialog({ url: '/blah?code=fakecode' }, { writeHead: writeHead, end: end });
    assert.calledTwice(readFile);
    assert.calledOnce(writeHead);
    assert.calledOnceWith(end, '<b>iver</b>');

  }

  //@TODO: add unit tests for routes.token and routes.me

});
