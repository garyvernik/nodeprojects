var request = require("http");

//var http = require('http');
//var client = http.createClient(3000, 'localhost'); 

//var request = client.request('GET', '/paypal/activity',
//  {'host': 'localhost'});
//request.end();
//request.on('response', function (response) {
//  console.log('STATUS: ' + response.statusCode);
//  console.log('HEADERS: ' + JSON.stringify(response.headers));
//  response.setEncoding('utf8');
//  response.on('data', function (chunk) {
//    console.log('BODY: ' + chunk);
//  });
//});



describe('My Server', function(){
    describe('GET /paypal/activity', function(){
        it("should respond with a list of users", function(done){
            request('http://localhost:3000/paypal/activity', function(err,resp,body){
                assert(!err);
                myuserlist = JSON.parse(body);
                assert(myuserlist.length, 12); 
                done(); 
            }); 
        }); 
    });
});

