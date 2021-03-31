var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
    //_id: Number,
    song: String,
    artist: String,
    album: String,
    year: Number,
    country: String
});

songSchema.methods.info = function () {
    var msj = "Id: " + this._id + " - Song: " + this.song;
    console.log(msj);
};

var Song = mongoose.model('Song', songSchema);

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'public','index.html'));
});


// Consultar todas las canciones
router.get('/all',function (req, res){
    Song.find(function (err, songs) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else
            res.status(200).json(songs);
        }
    )
});

// Consultar canciones del año X en adelante
router.get('/since',function (req, res){
    Song.find({ year: { $gte: req.query.year }},function (err, songs) {
        if (err) {
            console.log(err);
            res.status(500).send('Error al leer de la base de datos');
        }
        else
            res.status(200).json(songs);
    })
});

// Consultar canciones entre los parametros de query "desde" y "hasta"
router.get('/between',function (req, res){
    Song.find({ $and: [ {year: {$gte: req.query.year1}}, {year: {$lte: req.query.year2}}]},function (err, songs) {
        if (err) {
            console.log(err);
            res.status(500).send('Error al leer de la base de datos');
        }
        else
            res.status(200).json(songs);
    })
});

router.get('/download/:id', function (req, res) {
    let a = req.params.id;
    let afile = a + '.jpg';
    res.download(path.join(__dirname,'public','files', afile), afile,
        function(err){
            if (err)
                console.log('Ocurrio un error en la descarga.');
            else
                console.log('Descarga exitosa.');
        });
});

// Consultar canción por ID
router.get('/:id',function(req,res){
    Song.findById(req.params.id,function(err, song) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else{
            if (song != null) {
                res.status(200).json(song);
            }
            else
                res.status(404).send('No se encontro esa cancion');
        }
    });
});

// Agregar una canción
router.post('/',function(req,res){

    var _song = new Song({
        song: req.body.song,
        artist: req.body.artist,
        album: req.body.album,
        year: req.body.year,
        country: req.body.country
    });
    
    _song.save(function (error, song1) {
        if (error) {
            res.status(500).send('No se ha podido agregar.');
        }
        else {
            res.status(200).json({_id: song1._id});
        }
    });
});

// Modificar información de canción por su id
router.put('/:id',function(req,res){
    Song.findById(req.params.id,function(err, song) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else{
            if (song != null){
                song.song = req.body.song;
                song.artist = req.body.artist;
                song.album = req.body.album;
                song.year = req.body.year;
                song.country = req.body.country;

                song.save(function (error, result) {
                    if (error)
                        res.status(500).send('Error en la base de datos');
                    else {
                        res.status(200).send('Modificado exitosamente');
                    }
                });
            }
            else
                res.status(404).send('No se encontro esa canción');
        }
    });
});

// Eliminar una canción por su ID
router.delete('/:id',function(req,res){
    Song.findById(req.params.id,function(err, song) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else{
            if (song != null) {
                song.remove(function (error, result) {
                    if (error)
                        res.status(500).send('Error en la base de datos');
                    else {
                        res.status(200).send('Eliminado exitosamente');
                    }
                });
            }
            else
                res.status(404).send('No se encontro esa canción');
        }
    });
});

module.exports = router;