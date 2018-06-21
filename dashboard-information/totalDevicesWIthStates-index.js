var express = require('express');
var app = express();
var http = require('http');	
var server = http.createServer(app);

app.get('/test', function(req,res){
    var iothub = require('azure-iothub');
    var iothubEndPoint = "HostName=iotipdevSimulation.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=bqWoWm43eXCmP2b/A5VPvBk/hjTzWHQHmlNP2Xg081E=";

        var numberOfInactiveDevices = 0;
        var numberOfDevices = 0;
        var registry = iothub.Registry.fromConnectionString(iothubEndPoint);
        var query = registry.createQuery("SELECT * FROM devices WHERE status = 'disabled'", 100);
        var onResults = function (err, results) {
            if (err) {
                console.error('Failed to fetch the results: ' + err.message);
            } else {
                numberOfInactiveDevices += results.length;
                if (query.hasMoreResults) {
                    query.nextAsTwin(onResults);
                }
                totalDevicesQuery(numberOfInactiveDevices);
            }
        };
        query.nextAsTwin(onResults);
        function totalDevicesQuery(numberOfInactiveDevices) {
            var queryTotalDevices = registry.createQuery("SELECT * FROM devices ", 100);
            var onResults = function (err, results) {
                if (err) {
                    console.error('Failed to fetch the results: ' + err.message);
                } else {
                    numberOfDevices += results.length;
                    if (queryTotalDevices.hasMoreResults) {
                        queryTotalDevices.nextAsTwin(onResults);
                    }
                }
                resData(numberOfInactiveDevices, numberOfDevices);
            };
            queryTotalDevices.nextAsTwin(onResults);
        }
    
        function resData(inactiveDevices, totalDevices) {
            percentage = (inactiveDevices / totalDevices) * 100;
            var obj = {
                status: "success",
                data: {
                    totalDevices: totalDevices,
                    inactiveDevices: inactiveDevices,
                    activeDevices: totalDevices - inactiveDevices
                }
            }
            resTosend = {
                status: 200, /* Defaults to 200 */
                body: JSON.stringify(obj)
            };
            res.json(resTosend);
        }
});

server.listen(8080);