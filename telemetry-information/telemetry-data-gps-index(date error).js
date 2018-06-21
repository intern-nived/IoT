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
        //console.log(req.body.date);
        if (req.body.date == 'all') {
            console.log('JavaScript HTTP trigger function processed a request.');
            var querySpec = {
                'query': "SELECT * FROM messages m WHERE m.message.telemetryDataValue.latitude !='null' ORDER BY m.message.collectedTS DESC"
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
        } else if (req.body.date && req.body.device) {
            console.log('JavaScript HTTP trigger function processed a request.');
            var filterQuery = "SELECT * FROM messages m WHERE m.message.collectedTS >= '" + req.body.date + "' and m.deviceID = '"+ req.body.device + "' ORDER BY m.message.collectedTS ASC ";
            console.log(filterQuery);
            var querySpec = {
                'query': filterQuery
            };
            client.queryDocuments(collection, querySpec).toArray(function (err, results) {
                if (err) return console.log(err);
                console.log(results);
                if (results) {
                    resTosend = {
                        status: 200,
                        body: JSON.stringify(results)
                    };
                }
    
                res.json(resTosend);
            });
        } else {
            console.log("inside else");
            resTosend = {
                status: 400,
                body: "Empty Message Body Cannot Be Processed"
            };
            res.json(resTosend);
        }
});

server.listen(8000);