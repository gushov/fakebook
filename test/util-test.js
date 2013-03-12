/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var util = require('../lib/util');

buster.testCase("util", {

  "should call functions in a series": function (done) {

    var brushTeeth = this.stub().callsArgWith(0, null, 'teeth');
    var washFace = this.stub().callsArgWith(0, null, 'face');
    var goToBed = this.stub().callsArgWith(0, null, 'bed');

    util.next([
      brushTeeth,
      washFace,
      goToBed
    ], function (err, results) {
      assert.equals(results, ['teeth', 'face', 'bed']);
      done();
    });

  },

  "should return proper content type": function () {

    assert.equals(util.contentType('/styles/main.css'), 'text/css');
    assert.equals(util.contentType('http://jojo.com/img/zoe.jpg'), 'image/jpeg');
    assert.equals(util.contentType('/users/lena.txt'), 'text/plain');

  },

  "should parse form data to object": function () {

    var form = {
      'name': 'tree',
      'age': 40,
      'son.name': 'apple',
      'son.age': 0
    };

    assert.equals(util.formParser(form), {
      name: 'tree',
      age: 40,
      son: {
        name: 'apple',
        age: 0
      }
    });

  },

  "should parse stach template": function () {

    var template = [
      "{{name}} is a good boy\n",
      "his mom is: {{#mom}}{{name}}{{/mom}}\n",
      "his favorite things are:\n",
      "{{#favorites}}\n",
      "+{{name}}\n",
      "{{/favorites}}\n",
      "he was born on {{birthday}}"
    ];

    var data = {
      name: 'iver',
      birthday: '28.01.2013',
      mom: {
        name: 'martina'
      },
      favorites: [
        { name: 'mom' },
        { name: 'binki' }
      ]
    };

    var expected = [
      "iver is a good boy\n",
      "his mom is: martina\n",
      "his favorite things are:\n",
      "+mom\n",
      "+binki\n",
      "he was born on 28.01.2013"
    ];

    var result = util.stache(data, template.join(''));
    assert.equals(result, expected.join(''));

  }

});
