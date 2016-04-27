'use strict';

var assert = require('chai').assert;
var path = require('path');
var tesseract = require('../lib/tesseract');


describe('process', function () {

  it('should parse options to command', function () {
    var options = {
      binary: 'tesseract-ocr',
      l: 'chs',
      psm: '9',
      output: '/tmp/tesseract',
      '--tessdata-dir': './tessdata',
      '--user-words': './userwords',
      '--user-patterns': './userpatterns'
    };
    var command = 'tesseract-ocr test.png /tmp/tesseract -l chs -psm 9  --tessdata-dir ./tessdata --user-words ./userwords --user-patterns ./userpatterns';
    assert.equal(tesseract.command('test.png', options), command);
  });

  it('should return the string "node-tesseract"', function (done) {
    var image = path.join(__dirname, 'fixtures', 'test.png');
    tesseract.process(image, function (err, text) {
      assert.equal(text.trim(), 'node-tesseract');
      done();
    });

  })
});

