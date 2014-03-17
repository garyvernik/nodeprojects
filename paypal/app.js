var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");

// all requests handled by the server
var handle = {};
handle["/favicon.ico"] = requestHandlers.favicon;
handle["/paypal/conversionRate"] = requestHandlers.conversionRate;
handle["/paypal/currencyConversion"] = requestHandlers.currencyConversion;
handle["/paypal/saveRates"] = requestHandlers.saveRates;
handle["/paypal/activity"] = requestHandlers.activity;

var port = process.env.PORT || 3000;
server.start(router.route, handle, port);
