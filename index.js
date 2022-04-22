const express = require('express'); //importamos dependencia express
const mysql = require('mysql'); //importamos dependencia mysql
const formData = require("express-form-data");
const cors = require('cors');
const bodyParser = require('body-parser');
const { nextTick } = require('process');

const PORT = process.env.PORT || 3050;

const app = express();
app.use(formData.parse());

app.use(cors({
    origin: '*'
}));

const path = require('path'); //Normaliza rutas porque no son iguales en linux,windows...


var urlencodedParser = bodyParser.urlencoded({ extended: false })

//MySql
function conectar() {
    const connection = mysql.createConnection({
        host: '153.92.6.159',
        user: 'u786112244_admin',
        password: 'MisApps123!!!',
        database: 'u786112244_login_register',
    });
    return connection;
}



//Route (Si no encuentra lo de arriba)
app.get('/', (req, res) => {
    res.send('Bienvenido Angel esta es tu API!');
});

function insertaFacil(nombre,puntos){
    var connection = conectar();
    const sql = 'INSERT INTO clasificacionclimbfacil SET ?';
    const customerObj = {
        nombre_climb: nombre,
        puntuacion: puntos
    };
    connection.query(sql, customerObj, error => {
        if (error) throw error;
        console.log("Se ha registrado un nuevo usuario, llamado " + customerObj.nombre_climb);
    });
    connection.end();
}
function actualizaFacil(nombre,puntos){
    var connection = conectar();
    const sql = "UPDATE clasificacionclimbfacil SET puntuacion = '" + puntos + "' WHERE nombre_climb = '" + nombre  + "' ";
    const customerObj = {
        nombre_climb: nombre,
        puntuacion: puntos
    };
    connection.query(sql, error => {
        if (error) throw error;
        console.log("Se ha actualizado la puntuacion record de:  " + customerObj.nombre_climb);
    });
    connection.end();
}
app.post('/insertaFacil/', urlencodedParser, (req, res) => {
    const connection = conectar();
    const sql = "SELECT max(puntuacion) as puntos FROM clasificacionclimbfacil WHERE ? ";
    const customerObj = {
        nombre_climb: req.body.nombre_climb,
    };
    const customerObj2 = {
        puntuacion: req.body.elemento
    };
    connection.query(sql, customerObj, (error, results) => {
        if (error) throw error;  //si hay error enviamos el error
        if (results[0].puntos != null) { //si hay 1 o mas de 1 enviamos resultados

            if (customerObj2.puntuacion < results[0].puntos) { //Si ha superado su record...
                actualizaFacil(customerObj.nombre_climb,customerObj2.puntuacion);
            } else {
                console.log(customerObj.nombre_climb + " no ha superado su puntuacion record")
            }

        } else { //Si no hay resultado de puntuaciones record insertamos..
            insertaFacil(customerObj.nombre_climb,customerObj2.puntuacion);
        }
    });
    connection.end();
});
function insertaNormal(nombre,puntos){
    var connection = conectar();
    const sql = 'INSERT INTO clasificacionclimb SET ?';
    const customerObj = {
        nombre_climb: nombre,
        puntuacion: puntos
    };
    connection.query(sql, customerObj, error => {
        if (error) throw error;
        console.log("Se ha registrado un nuevo usuario, llamado " + customerObj.nombre_climb);
    });
    connection.end();
}
function actualizaNormal(nombre,puntos){
    var connection = conectar();
    const sql = "UPDATE clasificacionclimb SET puntuacion = '" + puntos + "' WHERE nombre_climb = '" + nombre  + "' ";
    const customerObj = {
        nombre_climb: nombre,
        puntuacion: puntos
    };
    connection.query(sql, error => {
        if (error) throw error;
        console.log("Se ha actualizado la puntuacion record de:  " + customerObj.nombre_climb);
    });
    connection.end();
}
app.post('/insertaNormal/', urlencodedParser, (req, res) => {
    const connection = conectar();
    const sql = "SELECT max(puntuacion) as puntos FROM clasificacionclimb WHERE ? ";
    const customerObj = {
        nombre_climb: req.body.nombre_climb,
    };
    const customerObj2 = {
        puntuacion: req.body.elemento
    };
    connection.query(sql, customerObj, (error, results) => {
        if (error) throw error;  //si hay error enviamos el error
        if (results[0].puntos != null) { //si hay 1 o mas de 1 enviamos resultados

            if (customerObj2.puntuacion < results[0].puntos) { //Si ha superado su record...
                actualizaNormal(customerObj.nombre_climb,customerObj2.puntuacion);
            } else {
                console.log(customerObj.nombre_climb + " no ha superado su puntuacion record")
            }

        } else { //Si no hay resultado de puntuaciones record insertamos..
            insertaNormal(customerObj.nombre_climb,customerObj2.puntuacion);
        }
    });
    connection.end();
});

app.post('/insertaMultijugador/', urlencodedParser, (req, res) => {
    let connection = conectar();
    const sql = 'INSERT INTO multijugador SET ?';

    const customerObj = {
        Victoria: req.body.ganador,
        Derrota: req.body.perdedor,
        Fecha: req.body.fecha
    };
    connection.query(sql, customerObj, error => {
        if (error) throw error;
        res.send('Usuario creado con exito');
        console.log("Se ha registrado un nuevo usuario, llamado " + customerObj.nombre_climb);
    });
    connection.end();
});

app.get('/normal/', (req, res) => {
    let connection = conectar();
    const sql = 'SELECT * FROM clasificacionclimb ORDER BY puntuacion ASC';

    connection.query(sql, (error, results) => {
        if (error) throw error;  //si hay error enviamos el error
        if (results.length > 0) { //si hay 1 o mas de 1 enviamos resultados
            res.json(results);
            console.log("Peticion recibida y respondida")
        } else {
            res.send('No hay resultados');  //de lo contrario no hay resultados
        }
    });
    connection.end();
});

app.get('/facil/', (req, res) => {
    let connection = conectar();
    const sql = 'SELECT * FROM clasificacionclimbfacil ORDER BY puntuacion ASC';

    connection.query(sql, (error, results) => {
        if (error) throw error;  //si hay error enviamos el error
        if (results.length > 0) { //si hay 1 o mas de 1 enviamos resultados
            res.json(results);
            console.log("Peticion recibida y respondida")
        } else {
            res.send('No hay resultados');  //de lo contrario no hay resultados
        }
    });
    connection.end();
});

app.get('/multijugador/', (req, res) => {
    let connection = conectar();
    const sql = 'SELECT * FROM multijugador ORDER BY Fecha DESC';

    connection.query(sql, (error, results) => {
        if (error) throw error;  //si hay error enviamos el error
        if (results.length > 0) { //si hay 1 o mas de 1 enviamos resultados
            res.json(results);
            console.log("Peticion recibida y respondida")
        } else {
            res.send('No hay resultados');  //de lo contrario no hay resultados
        }
    });
    connection.end();
});

app.get('/pvp/', (req, res) => {
    let connection = conectar();
    const sql = 'SELECT Victoria,COUNT(Victoria) FROM multijugador GROUP BY Victoria';

    connection.query(sql, (error, results) => {
        if (error) throw error;  //si hay error enviamos el error
        if (results.length > 0) { //si hay 1 o mas de 1 enviamos resultados
            res.json(results);
            console.log("Peticion recibida y respondida")
        } else {
            res.send('No hay resultados');  //de lo contrario no hay resultados
        }
    });
    connection.end();
});



app.listen(PORT, () => console.log("Servidor funcionando por el puerto " + PORT));  //las ``se usan para concatenaciones
