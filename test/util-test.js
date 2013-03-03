/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require('buster');
var util = require('../lib/util');


buster.testCase("util", {

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
