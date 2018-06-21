var express = require('express');
var app = express();
var http = require('http');	
var server = http.createServer(app);

app.get('/test', function(req,res){
    var iothub = require('azure-iothub');
    var iothubEndPoint = "HostName=devicesimulation.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=jpulxh92A7OP57+fmwTzUXjn7C5MPLHiM4HrX6GjsyQ=";
        var numberOfActiveDevices = 0;
        var numberOfDevices = 0;
        var registry = iothub.Registry.fromConnectionString(iothubEndPoint);
        var query = registry.createQuery("SELECT * FROM devices WHERE status = 'enabled'", 100);
        var onResults = function (err, results) {
            if (err) {
                console.error('Failed to fetch the results: ' + err.message);
            } else {
                numberOfActiveDevices += results.length;
                if (query.hasMoreResults) {
                    query.nextAsTwin(onResults);
                }
                totalDevicesQuery(numberOfActiveDevices);
            }
        };
        query.nextAsTwin(onResults);
        function totalDevicesQuery(numberOfActiveDevices) {
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
                resData(numberOfActiveDevices, numberOfDevices);
            };
            queryTotalDevices.nextAsTwin(onResults);
        }
    
        function resData(activeDevices, totalDevices) {
            percentage = (activeDevices / totalDevices) * 100;
            var obj = {
                status: "success",
                data:{
                totalDevicePercent:100,
                activeDevicesPercent: percentage,
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
//app.listen(8080);