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

const connection = mysql.createConnection({
    host: '153.92.6.159',
    user:'u786112244_admin',
    password:'MisApps123!!!',
    database:'u786112244_login_register',
});

//Route (Si no encuentra lo de arriba)
app.get('/', (req, res) => {
    res.send('Bienvenido Angel esta es tu API!');
})

app.post('/ajax/', urlencodedParser, (req, res) => {
    //console.log(req.body.nombre_climb);
    //console.log(req.body.elemento);
    connection.connect();
    const sql = 'INSERT INTO nodejs SET ?';

    const customerObj = { 
        nombre:req.body.nombre_climb,
        puntuacion:req.body.elemento
    };
    connection.query(sql,customerObj, error => {
        if (error) throw error;
        res.send('Usuario creado con exito');
        console.log("Se ha registrado un nuevo usuario, llamado " + customerObj.nombre);
    }); 
    connection.end();
});

app.get('/normal/',(req, res) => {
    connection.connect();
    const sql = 'SELECT * FROM clasificacionclimb ORDER BY puntuacion ASC';

    connection.query(sql, (error,results) => {
        if (error) throw error;  //si hay error enviamos el error
        if (results.length > 0){ //si hay 1 o mas de 1 enviamos resultados
            res.json(results);
            console.log("Peticion recibida y respondida")
        }else {
            res.send('No hay resultados');  //de lo contrario no hay resultados
        }
    });
    connection.end();
});

app.get('/facil/',(req, res) => {
    connection.connect();
    const sql = 'SELECT * FROM clasificacionclimbfacil ORDER BY puntuacion ASC';

    connection.query(sql, (error,results) => {
        if (error) throw error;  //si hay error enviamos el error
        if (results.length > 0){ //si hay 1 o mas de 1 enviamos resultados
            res.json(results);
            console.log("Peticion recibida y respondida")
        }else {
            res.send('No hay resultados');  //de lo contrario no hay resultados
        }
    });
    connection.end();
});

app.get('/multijugador/',(req, res) => {
    connection.connect();
    const sql = 'SELECT * FROM multijugador ORDER BY Fecha DESC';

    connection.query(sql, (error,results) => {
        if (error) throw error;  //si hay error enviamos el error
        if (results.length > 0){ //si hay 1 o mas de 1 enviamos resultados
            res.json(results);
            console.log("Peticion recibida y respondida")
        }else {
            res.send('No hay resultados');  //de lo contrario no hay resultados
        }
    });
    connection.end();
});



app.listen(PORT, () => console.log("Servidor funcionando por el puerto " + PORT));  //las ``se usan para concatenaciones
