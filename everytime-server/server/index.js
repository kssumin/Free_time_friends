//import { createRequire } from "module";
//const require = createRequire(import.meta.url);

const express = require('express');
const {logger} = require('./config/winston.js');

//import express from './config/express.js';
//import {logger} from './config/winston.js';


const app = express();
const tableRouter = require("./src/app/Table/tableRoute.js");
app.use("/", tableRouter);

app.get("/", (req, res) => {
    res.send("Hello world");
});

const port = 3000;
app.listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
