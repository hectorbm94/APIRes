// server.js

// Incluímos las dependencias que vamos a usar
var express = require("express"),
    app     = express(),
    http    = require("http"),
    qs = require('querystring'),
    multer = require('multer'),
    fse = require('fs-extra'),
    mongoose = require('mongoose'),
    server  = http.createServer(app);

var upload = multer({ dest: 'public/' });

// Configuramos la app para que pueda realizar métodos REST
app.configure(function () {

  app.use(express.methodOverride()); // HTTP PUT and DELETE support
  app.use(express.limit('20mb'));
  app.use(app.router); // simple route management

});

// petición GET para obtener una canción
app.get('/cancion/:trackname', function(req, res) {
  res.sendfile('/mnt/nas/canciones/' + req.params.trackname);
});

app.get('/imagen/:imagename', function(req, res) {

  res.sendfile('/mnt/nas/imagenes/' + req.params.imagename);
});

// petición DELETE para borrar una canción
app.delete('/cancion/:trackname', function(req, res) {
  fse.unlink('/mnt/nas/canciones/' + req.params.trackname, function(err){
	if (err) return console.error(err);
	console.log('delete success');
  });
  res.send(200);
});

// petición DELETE para borrar una imagen
app.delete('/imagen/:imagename', function(req, res) {
  fse.unlink('/mnt/nas/imagenes/' + req.params.imagename, function(err){
	if (err) return console.error(err);
	console.log('delete success');
  });
  res.send(200);
});

// petición POST para subir una canción
app.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'track', maxCount: 1 }]), function (req, res, next) {

    console.log(req.files['image'][0]);
    console.log(req.files['track'][0]);
    var imagen = req.files['image'][0];
    var cancion = req.files['track'][0];
    //extensiones de la imagen y cancion
    var ext = imagen.mimetype.split('/')[1];
    var ext1 = cancion.mimetype.split('/')[1];
    //mover la cancion e imagen a los discos nas 
    fse.move(cancion.path, '/mnt/nas/canciones/' + cancion.originalname + '.' + ext1, function (err) {
   	if (err) return console.error(err);
  		console.log("success!")
    });
    fse.move(imagen.path, '/mnt/nas/imagenes/' + imagen.originalname + '.' + ext, function (err) {
   	if (err) return console.error(err);
  		console.log("success!")
    });
    res.send(200);
})

// El servidor escucha en el puerto 3000
server.listen(3000, function() {
  console.log("Node server running on :3000");
});
