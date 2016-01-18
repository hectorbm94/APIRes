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
  app.use(express.limit('20mb'));    // Tamaño maximo
  app.use(app.router); 		     // simple route management

});

// petición GET para obtener una canción
app.get('/cancion/:trackname', function(req, res) {
  res.sendfile('/mnt/nas/canciones/' + req.params.trackname);
});

// petición GET para obtener una imagen
app.get('/imagen/:imagename', function(req, res) {
	console.log(req.params.imagename);
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
	
	var done = false;
    console.log('Datos de la canción subida: ' + req.files['track'][0]);
    var cancion = req.files['track'][0];
    //extension de la cancion
    fse.move(cancion.path, '/mnt/nas/canciones/' + cancion.originalname, function (err) {
   	if (err) return console.error(err);
  		console.log("success!")
		done = true;
    });
    if(req.files['image']!== undefined){
		done = false;
	    console.log('Datos de la portada subida: ' + req.files['image'][0]);
	    var imagen = req.files['image'][0];
	    //extensiones de la imagen
	    fse.copySync(imagen.path, '/mnt/nas/imagenes/' + imagen.originalname, function (err) {
			 	if (err) return console.error(err);
					console.log("success!")
				done = true;
	    });
			/*try {
				fs.copySync(imagen.path, '/mnt/nas/imagenes/' + imagen.originalname)
			} catch (err) {
				console.error('Oh no, there was an error: ' + err.message)
			}*/

			fse.unlink(imagen.path, function(err){
				if (err) return console.error(err);
				console.log('delete success');
			});
			done = true;
    }
		
    if (done){
		res.send(200);
	} else {
		res.send('it seems something has go wrong');
	}
})

// El servidor escucha en el puerto 3000
server.listen(3000, function() {
  console.log("Node server running on :3000");
});
