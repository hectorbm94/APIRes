// server.js

// Incluímos las dependencias que vamos a usar
var express = require("express"),
    app     = express(),
    http    = require("http"),
    qs = require('querystring'),
    multer = require('multer'),
    server  = http.createServer(app);

var upload = multer({ dest: 'public/' });

// Configuramos la app para que pueda realizar métodos REST
app.configure(function () {

  app.use(express.methodOverride()); // HTTP PUT and DELETE support
  app.use(express.limit('4mb'));
  app.use(app.router); // simple route management

});

// petición GET del root que sólo muestre "Hello world!"
app.get('/', function(req, res) {
  res.send("Hello world!");
});

// petición POST DE PRUEBA"
/*app.post('/formpost', function(req, res) {
  //res.send("Funciona el post!");
  res.redirect('http://localhost:8080/tracks');
});*/

// Ruta para subir el archivo.
app.post('/', upload.single('file'), function (req, res, next) {

    console.log(req.file); //form files
    res.send(200);
})


// El servidor escucha en el puerto 3000
server.listen(3000, function() {
  console.log("Node server running on :3000");
});
