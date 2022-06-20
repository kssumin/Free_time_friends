const express = require('express');
const mysql = require('mysql2');
const { connect } = require("./Table/tableRoute");

const router = express.Router();


const conn = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '203190',
    database: 'projectdb'
};

const connection = mysql.createConnection(conn);
connection.connect();

router.get("/professorname/:professorname/coursename/:coursename", function(req, res){
    var sql='SELECT * FROM projectdb.course WHERE professorname=? AND coursename=?';

    var professorname=req.param.professorname;
    var coursename=req.param.coursename;
    connection.query(sql, [professorname, coursename], function(err, topic, fields){
        if (error) {
            console.log(error);
        }
        console.log(results);
    });
    
});

var sql2='SELECT * FROM projectdb.course WHERE professorname="박재형"';
connection.query(sql2, function(error, results, fields){
    if (error) {
        console.log(error);
    }
    console.log(results);
});

console.log("Hello");
module.exports = router;
connection.end();