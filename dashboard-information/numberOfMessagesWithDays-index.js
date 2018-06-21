var express = require('express');
var app = express();
var http = require('http');	
var server = http.createServer(app);

app.get('/test', function(req,res){
    var config = {};
    var resObj = {};
    config.endpoint = "https://iothub.documents.azure.com:443/";
    config.primaryKey = "ozlixErxAfNqrVIiRmas92PagMwOuyGva6nOTyCy394JMl920ecFRelVleeKk8lM9bglhuVViE0Ojllpd937gw==";
    var databaseUrl = `dbs/iothubmessages`;
    var groupArray = require('group-array');
    var collection = `${databaseUrl}/colls/messages`;
    var documentClient = require("documentdb").DocumentClient;
    var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });
        console.log('JavaScript HTTP trigger function processed a request.');
        var querySpec = {
            'query': "SELECT m.deviceID,m.message FROM message m"
        };
        client.queryDocuments(collection, querySpec).toArray(function (err, results) {
            if (err) return console.log(err);
            // context.log(results);
            var dataGroupByDevice = groupArray(results, 'message.collectedTS');
            console.log(dataGroupByDevice)
            for (var key in dataGroupByDevice) {
                // context.log(dataGroupByDevice[key]);
                resObj[key] = dataGroupByDevice[key].length;
            }
            responseToSend = {
                status : "success",
                data : resObj
            }
            resTosend = {
                status: 200,
                body: JSON.stringify(responseToSend)
            };
            res.json(resTosend);
        });
});

server.listen(8080);