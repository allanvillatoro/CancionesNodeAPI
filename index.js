var express = require('express');
var canciones = require('./canciones');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //necesario para capturar datos en formato json

app.listen(8888, function () {
  console.log('Escuchando en puerto 8888!');
});

//NECESARIO PARA SERVIR ESTA API A OTROS CON OTRO DOMINIO
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect('mongodb://localhost/cancionesdatabase',{ useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
    if (error) console.error(error);
    else console.log('Mongo Atlas Conectado!');
});

app.use('/api/canciones', canciones);

app.get('/',function (req, res) {
	res.send('Pagina Principal');
});

app.use(function(req, res, next) {
    res.status(404).send('Error! Esta pagina no existe!');
});