var http = require("http");
var url = require("url");
var qs = require("querystring");
var rateModule = require('./rate');

function start(route, handle, port) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var params = qs.parse(url.parse(request.url).query);
    route(handle, pathname, response, params);
  }

  var server = http.createServer(onRequest).listen(port);
  console.log("Server has started listening on port " + port);
  
  process.on('SIGINT', function() {
    rateModule.saveRates();
    process.exit(0);
  });
}

exports.start = start;