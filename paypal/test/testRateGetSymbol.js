var testCase = require('mocha').describe
//var pre = require('mocha').before
var assert = require('assert');
var rateModule = require('../rate');

describe('rate#getSymbol()', function(){
  
  it('should return symbol for capped abbreviation', function() {
    assert.equal(rateModule.getSymbol('JPY'), '&#65509;');
  });
  
  it('should return symbol for low-case abbreviation', function() {
    assert.equal(rateModule.getSymbol('jpy'), '&#65509;');
  });

  it('should return symbol for non-existing abbreviation', function() {
    assert.equal(rateModule.getSymbol('xyz'), '');
  });
  
  it('should return symbol for empty abbreviation', function() {
    assert.equal(rateModule.getSymbol(''), '');
  });

  it('should return symbol for no arg', function() {
    assert.equal(rateModule.getSymbol(), '');
  });

  it('should return symbol for low-case abbreviation and another arg', function() {
    assert.equal(rateModule.getSymbol('jpy', 'foo'), '&#65509;');
  });

});


