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
app.get('/:trackname', function(req, res) {
  
  //res.sendfile('public/' + req.params.trackname);
  res.sendfile('/mnt/nas/canciones/' + req.params.trackname);
});

// petición DELETE para borrar una canción
app.delete('/:trackname', function(req, res) {
  fse.unlink('/mnt/nas/canciones/' + req.params.trackname, function(err){
	if (err) return console.error(err);
	console.log('delete success');
  });
  res.send(200);
});

// petición POST para subir una canción
app.post('/', upload.single('file'), function (req, res, next) {

    console.log(req.file); //form files
    fse.move(req.file.path, '../mnt/nas/canciones/' + req.file.originalname + '.mp3', function(err){
	if (err) return console.error(err);
	console.log('success');
    });
    console.log(req.file.path);
    res.send(200);
})

// El servidor escucha en el puerto 3000
server.listen(3000, function() {
  console.log("Node server running on :3000");
});
