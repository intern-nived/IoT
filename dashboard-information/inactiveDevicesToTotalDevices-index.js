var express = require('express');
var app = express();
var http = require('http');	
var server = http.createServer(app);

app.get('/test', function(req,res){
    var iothub = require('azure-iothub');
    var iothubEndPoint = "HostName=iotipdevSimulation.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=bqWoWm43eXCmP2b/A5VPvBk/hjTzWHQHmlNP2Xg081E=";
        var numberOfActiveDevices = 0;
        var numberOfInactiveDevices = 0;
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
                inactiveDevicesQuery(numberOfActiveDevices);
            }
        };
        query.nextAsTwin(onResults);
        function inactiveDevicesQuery(numberOfActiveDevices) {
            var queryInactive = registry.createQuery("SELECT * FROM devices WHERE status = 'disabled'", 100);
            var onResults = function (err, results) {
                if (err) {
                    console.error('Failed to fetch the results: ' + err.message);
                } else {
                    numberOfInactiveDevices += results.length;
                    if (queryInactive.hasMoreResults) {
                        queryInactive.nextAsTwin(onResults);
                    }
                }
                resData(numberOfActiveDevices, numberOfInactiveDevices);
            };
            queryInactive.nextAsTwin(onResults);
        }
        function resData(activeDevices, inactiveDevices) {
            percentage = (inactiveDevices / activeDevices) * 100;
            var obj = {
                status: "success",
                data: {
                    activeDevicePercent:100,
                    inactiveDevicePercent: percentage
                }
            }
             resTosend = {
                status: 200, /* Defaults to 200 */
                body: JSON.stringify(obj)
            };
            res.json(resTosend);
        }

    var iothub = require('azure-iothub');
    var iothubEndPoint = "HostName=iotipdevSimulation.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=bqWoWm43eXCmP2b/A5VPvBk/hjTzWHQHmlNP2Xg081E=";
        var numberOfActiveDevices = 0;
        var numberOfInactiveDevices = 0;
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
                inactiveDevicesQuery(numberOfActiveDevices);
            }
        };
        query.nextAsTwin(onResults);
        function inactiveDevicesQuery(numberOfActiveDevices) {
            var queryInactive = registry.createQuery("SELECT * FROM devices WHERE status = 'disabled'", 100);
            var onResults = function (err, results) {
                if (err) {
                    console.error('Failed to fetch the results: ' + err.message);
                } else {
                    numberOfInactiveDevices += results.length;
                    if (queryInactive.hasMoreResults) {
                        queryInactive.nextAsTwin(onResults);
                    }
                }
                resData(numberOfActiveDevices, numberOfInactiveDevices);
            };
            queryInactive.nextAsTwin(onResults);
        }
        function resData(activeDevices, inactiveDevices) {
            percentage = (inactiveDevices / activeDevices) * 100;
            var obj = {
                status: "success",
                data: {
                    activeDevicePercent:100,
                    inactiveDevicePercent: percentage
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