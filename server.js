// server.js
// =========

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
  app.use(express.bodyParser()); // JSON parsing
  //app.use(express.json());
  //app.use(express.urlencoded());
  app.use(express.methodOverride()); // HTTP PUT and DELETE support
  app.use(express.limit('4mb'));
  app.use(app.router); // simple route management
  app.use(multer({ dest: './public/'}))
});

// petición GET del root que sólo muestre "Hello world!"
app.get('/', function(req, res) {
  res.send("Hello world!");
});

// petición POST DE PRUEBA"
/*app.post('/formpost', function(req, res) {
  //res.send("Funciona el post!");

  var body = '';
  req.on("data", function(data){
  	body += data;
  });
  req.on("end", function () {
  	var post = qs.parse(body);
  });
  var post = qs.parse(body);
  console.log(post);
  console.log(body);

  res.redirect('http://localhost:8080/tracks');
});*/

// Ruta para subir el archivo.
app.post('/', upload.single('track'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.body); //form fields
    console.log(req.file); //form files
})


// El servidor escucha en el puerto 3000
server.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});
