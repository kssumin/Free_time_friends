const express = require('express');
const { logger } = require('./config/winston.js');
const sendSubRouter = require('./src/app/sendSubRoute.js');



const app = express();
const tableRouter = require("./src/app/Table/tableRoute.js");
app.use("/", tableRouter);
app.use("/", sendSubRouter);

app.get("/", (req, res) => {
    res.send("Hello world");
});

const port = 3000;
app.listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

/*
const mysql = require('./database')();

const connection = mysql.init();

mysql.db_open(connection);

connection.query('SELECT * from ', 
function (error, results, fields){
    if (error){
        console.log(error);
    }
    console.log(results);
});
*/

/*
const mysql = require('mysql2');
const conn = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '203190',
    database: 'projectdb'
};

const connection = mysql.createConnection(conn);
connection.connect();

var sql = 'SELECT * FROM course';

connection.query(sql,
    function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log(results);
    });

connection.end();
*/
