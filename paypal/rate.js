var http = require('http');
var fs = require('fs');

// local cache file
const ratesFile = 'rates.txt';
// symbolds file
const signsFile = 'symbols.txt';
// key/value separator
const splitSymbol = '=';

// rates cache
var rateTable = {};
// html codes for currencies
var signs = {};


// read cache from file
function readFile(file, map) {
  try {
    fs.readFileSync(file).toString().split('\n').forEach(function(line) { 
        if (line) {
          var res = line.split(splitSymbol);
          map[res[0]] = res[1].trim();
        }
    });
    console.log('Read from ' + file + ' file: ');
    for (var key in map) {
      if (map.hasOwnProperty(key)) {
        console.log(key + splitSymbol + map[key]);
      }
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log(file + ' file not found!');
    } else {
      throw e;
    }
  }
}

function getRate(from, to, live, onSuccess, onError) {
  var fromto = (from + to).toUpperCase();
  // download
  if (live || !rateTable[fromto]) {
    downloadRate(fromto, 
      function(rate) {
        rateTable[fromto] = rate;
        onSuccess(rate);
      }, onError);
  } else {
    // read from cache
    rate = rateTable[fromto];
    console.log('Returning cached rate for ' + fromto + ' = ' + rate);
    onSuccess(rate);
  }
}

function downloadRate(fromto, onSuccess, onError) {
  console.log('Downloading rate for ' + fromto);
  var rate = '';
  var req = http.get('http://download.finance.yahoo.com/d/quotes.csv?s=' + fromto + '=X&f=l1&e=.csv', function(res) {
    res.on('data', function(chunk) {
      rate += chunk;
    });
  
    res.on('end', function() {
      // if the requested symbols not found, "0" exchange rate is returned
      if (rate > 0) {
        rate = rate.trim();
        console.log('Downloaded rate is ' + rate);
        onSuccess(rate);
      } else {
        var err = 'specified currency symbols not found';
        console.error(err);
        onError(err);
      }
    });
  });
  
  req.on('error', function(err) {
    console.log('detected error ' + err);
    onError(err);
  });
}

// save cache to file
function saveRates() {
  console.log('Saving rates to file.');

  var context = '';
  if (Object.keys(rateTable).length > 0) {
    for (var key in rateTable) {
      if (rateTable.hasOwnProperty(key)) {
        context += (key + splitSymbol + rateTable[key] + '\n');
      }
    }
  }
  fs.writeFileSync(ratesFile, context);
}

// returns currency symbol
function getSymbol(currency) {
  if (currency.toUpperCase() in signs) {
    return signs[currency.toUpperCase()];
  } else {
    return '';
  }
}

// return symbols map
function getSymbols() {
  return signs;
}

// for testing the cache
function printTable() {
  console.log('size ' + Object.keys(rateTable).length);
  if (Object.keys(rateTable).length > 0) {
    for (var key in rateTable) {
      if (rateTable.hasOwnProperty(key)) {
        console.log(key + splitSymbol + rateTable[key]);
      }
    }
  }

}


// main

readFile(ratesFile, rateTable);
readFile(signsFile, signs);


exports.getRate = getRate;
exports.saveRates = saveRates;
exports.getSymbol = getSymbol;
exports.getSymbols = getSymbols;