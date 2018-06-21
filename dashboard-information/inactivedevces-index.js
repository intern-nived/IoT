var express = require('express');
var app = express();
var http = require('http');	
var server = http.createServer(app);

app.get('/test', function(req,res){
    console.log("hello")
	var iothub = require('azure-iothub');
    var iothubEndPoint = "HostName=iotipdevSimulation.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=bqWoWm43eXCmP2b/A5VPvBk/hjTzWHQHmlNP2Xg081E=";
    var responseToSend = 0;
    var registry = iothub.Registry.fromConnectionString(iothubEndPoint);
    var query = registry.createQuery("SELECT * FROM devices WHERE status = 'disabled'", 100);
    var onResults = function (err, results) {
        if (err) {
            console.error('Failed to fetch the results: ' + err.message);
        } else {
            responseToSend += results.length;
            if (query.hasMoreResults) {
                query.nextAsTwin(onResults);
            }
        }
        var obj = {
            status: "success",
            value: responseToSend
        };
        resTosend = {
            status: 200, /* Defaults to 200 */
            body: JSON.stringify(obj)
        };
       res.json(resTosend);
    };
    query.nextAsTwin(onResults);
});

server.listen(8080);
//app.listen(8080);