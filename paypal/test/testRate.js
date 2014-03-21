var testCase = require('mocha').describe
//var pre = require('mocha').before
var assert = require('assert');
var nock = require('nock');

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

  it('should return symbol for null arg', function() {
    assert.equal(rateModule.getSymbol(null), '');
  });

  it('should return symbol for undefined arg', function() {
    assert.equal(rateModule.getSymbol(undefined), '');
  });

  it('should return symbol for low-case abbreviation and another arg', function() {
    assert.equal(rateModule.getSymbol('jpy', 'foo'), '&#65509;');
  });

});


describe('rate#getRate()', function(){

  var rate = 2.3;
 
  it('should return mocked USD-JPY conversion rate', function() {
    var from = 'USD';
    var to = 'JPY';
    
    nock('http://download.finance.yahoo.com')
        .get('/d/quotes.csv?s=' + from + to + '=X&f=l1&e=.csv')
        .reply(200, rate); 
        
    rateModule.getRate(from, to, true, 
        function(res) { 
          console.log('success ' + res); 
          assert.equal(res, rate);
        }, 
        function(err) { 
          console.log('detected error ' + err); 
        }
    );
  });
  
  it('should return cached USD-JPY conversion rate', function() {
    var from = 'USD';
    var to = 'JPY';
    
    rateModule.getRate(from, to, false, 
        function(res) { 
          console.log('success ' + res); 
          assert.equal(res, rate);
        }, 
        function(err) { 
          console.log('detected error ' + err); 
        }
    );
  });

  it('should return cached USD-JPY conversion rate if live param is not true', function() {
    var from = 'USD';
    var to = 'JPY';
    
    rateModule.getRate(from, to, 123, 
        function(res) { 
          console.log('success ' + res); 
          assert.equal(res, rate);
        }, 
        function(err) { 
          console.log('detected error ' + err); 
        }
    );
  });

  it('should return mocked USD-JPY conversion rate for lower case input', function() {
    var from = 'usd';
    var to = 'jpy';
    
    nock('http://download.finance.yahoo.com')
        .get('/d/quotes.csv?s=' + from.toUpperCase() + to.toUpperCase() + '=X&f=l1&e=.csv')
        .reply(200, rate); 
        
    rateModule.getRate(from, to, true, 
        function(res) { 
          console.log('success ' + res); 
          assert.equal(res, rate);
        }, 
        function(err) { 
          console.log('detected error ' + err); 
        }
    );
  });

  it('should return 0 conversion rate for invalid abbreviation input', function() {
    var from = 'XYZ';
    var to = 'JPY';
    
    nock('http://download.finance.yahoo.com')
        .get('/d/quotes.csv?s=' + from + to + '=X&f=l1&e=.csv')
        .reply(200, 0); 
        
    rateModule.getRate(from, to, true, 
        function(res) { 
          console.log('success ' + res); 
          // success not expected
          assert.fail(res, 0);
        }, 
        function(err) { 
          console.log('detected error ' + err); 
          // expected
        }
    );
  });


});