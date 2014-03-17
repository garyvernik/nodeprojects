var fs = require('fs');
var http = require('http');
var rateModule = require('./rate');
var activityModule = require('./activity');


function favicon(response) {
  console.log("Request handler 'favicon' was called.");
  var img = fs.readFileSync('./favicon.ico');
  response.writeHead(200, {"Content-Type": "image/x-icon"});
  response.end(img,'binary');
}

// expects:
// 1. from and to currency symbols
// 2. live flag (tue|false). If false, it will try to 
//  fetch the quote from the cache. If fails, fetches it live
function conversionRate(response, params) {
  console.log("Request handler 'conversionRate' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  var fromDetected = false;
  var toDetected = false;
  var from = params.from;
  var to = params.to;
  if (from) {
    fromDetected = true;
  }
  
  if (to) {
    toDetected = true;
  }
  
  if (fromDetected && toDetected) {
    rateModule.getRate(from, to, params.live == 'true',
      function(rate) {
        var fromSymbol = getSymbol(from);
        var toSymbol = getSymbol(to);
        response.write("<div>1 " + from.toUpperCase() + fromSymbol + " is " + rate + ' ' + to.toUpperCase() + toSymbol + " </div>");
        response.end();
      },
      function(error) {
        response.write("<div>Failed to download exchange rate from " + from + " to " + to + ".</div>");
        response.end();
      });
  } else {
    response.write("<em>\"from\" and \"to\" params required</em>");
    response.end();
  }
}

// expects:
// 1. from and to currency symbols
// 2. live flag (tue|false). If false, it will try to 
//  fetch the quote from the cache. If fails, fetches it live
// 3. amount
function currencyConversion(response, params) {
  console.log("Request handler 'currencyConversion' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  var fromDetected = false;
  var toDetected = false;
  var amountDetected = false;
  var from = params.from;
  var to = params.to;
  var amount = params.amount;
  if (from) {
    fromDetected = true;
  }
  if (to) {
    toDetected = true;
  }
  if (amount && !isNaN(amount)) {
    amountDetected = true;
  }

  if (fromDetected && toDetected && amountDetected) {
    rateModule.getRate(from, to, params.live == 'true',
      function(rate) {
        var fromSymbol = getSymbol(from);
        var toSymbol = getSymbol(to);
        response.write("<div>" + amount + from.toUpperCase() + fromSymbol + " is equal to " + 
            Math.round(amount * rate * 100) / 100 + ' ' + to.toUpperCase() + toSymbol + " </div>");
        response.end();
      },
      function(error) {
        console.error(error);
        response.write("<div>Failed to download exchange rate from " + from + " to " + to + ".</div>");
        response.end();
      });
  } else {
    response.write("<em>\"from\", \"to\" and \"amount\" params required</em>");
    response.end();
  }
}

function saveRates(response, params) {
  rateModule.saveRates();
  response.end();
}

function activity(response, params) {
  console.log("Request handler 'activity' was called.");
  
  var cur = params.cur;
  if (!cur) {
    cur = 'USD';
  } else {
    cur = cur.toUpperCase();
  }
  
  response.writeHead(200, {"Content-Type": "text/html"});

  if (cur == 'USD') {
    generateActivitiesPage(cur, 1, response);
  } else {
    rateModule.getRate('USD', cur, true,
      function(rate) {
        generateActivitiesPage(cur, rate, response);
      },
      function(error) {
        console.log(error);
        response.write("<div>Failed to download exchange rate from USD to " + cur + ". Showing amounts in USD.</div>");
        generateActivitiesPage(cur, 1, response);
      });
  }
  
}

function getSymbol(abr) {
  var symbol = rateModule.getSymbol(abr);
  if (symbol != '') {
    symbol = ('(' + symbol + ')');
  }
  
  return symbol;
}

function generateActivitiesPage(cur, rate, response) {
  response.write("<h1 style='text-align:center'>Transaction History</h1>");

  response.write("<h3 style='text-align:center'>Amounts are shown in " + cur + getSymbol(cur) + "</h3>");
  
  response.write("<h3 style='text-align:center'>Select a different currency: ");
  response.write("<select onchange=\"window.location='/paypal/activity?cur=' + this.value;\">");

  var symbols = rateModule.getSymbols();
  for (var key in symbols) {
    if (symbols.hasOwnProperty(key)) {
      response.write("<option ");
      if (key == cur) {
        response.write("selected ");
      }
      response.write("value=" + key + ">" + key + getSymbol(key) + "</option>");
    }
  }
  response.write("</select>");
  response.write("</h3>");

  response.write("<table align='center' cellpadding='20' border='0'>");
  response.write("<tr style='background:0099CC'> <th>Date</th><th>Location</th><th>Amount</th></tr>");
  
  var records = activityModule.activity();
  var arrayLength = records.length;
  var color;
  for (var i = 0; i < arrayLength; i++) {
    if (i % 2 == 1) {
      color = "C8C8C8";
    } else {
      color = "A8A8A8";
    }
    response.write("<tr style=\"background:" + color + "\" >");
    response.write("<td>" + records[i].date + "</td>");
    response.write("<td>" + records[i].location + "</td>");
    response.write("<td>" + (Math.round(records[i].amount * rate * 100) / 100) + "</td>");
    response.write("</tr>");

    console.log(records[i].date + ' ' + records[i].location + ' ' + records[i].amount);
  }
  
  response.write("</table>");

  response.end();
}


exports.favicon = favicon;
exports.conversionRate = conversionRate;
exports.currencyConversion = currencyConversion;
exports.saveRates = saveRates;
exports.activity = activity;