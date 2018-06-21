var express = require('express');
var app = express();
var http = require('http');	
var server = http.createServer(app);

app.get('/test', function(req,res){
    var config = {};
    config.endpoint = "https://iothub.documents.azure.com:443/";
    config.primaryKey = "ozlixErxAfNqrVIiRmas92PagMwOuyGva6nOTyCy394JMl920ecFRelVleeKk8lM9bglhuVViE0Ojllpd937gw==";
    var databaseUrl = `dbs/iothubmessages`;
    var collection = `${databaseUrl}/colls/messages`;
    var documentClient = require("documentdb").DocumentClient;
    var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });
        console.log('JavaScript HTTP trigger function processed a request.');
        var querySpec = {
            'query': "SELECT m.deviceID FROM messages m WHERE m.message.telemetryDataValue.latitude !='null' ORDER BY m.message.collectedTS DESC"
        };
        client.queryDocuments(collection, querySpec).toArray(function (err, results) {
            if (err) return console.log(err);
            console.log(results);
            resTosend = {
                status: 200,
                body: JSON.stringify(results)
            };
            res.json(resTosend);
        });
});

server.listen(8080);