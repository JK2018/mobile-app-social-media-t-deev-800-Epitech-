'use strict';
const express=require('express')
const app =express();
const bodyParser = require('body-parser');
const router = express.Router();

var Envrionnement=require('./settings/env')
//Récupération du port à partir de fichier environnement:
const port=process.env.PORT||Envrionnement.port;


 
 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', false); 
    next();
});

//Création serveur :
var server =require('http').createServer(app).listen(port);
 
app.use(bodyParser.json());
require('./routes/globalroutes')(router);
app.use(router);

console.log("Serveur démarré sur le port : "+port);