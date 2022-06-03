//import user from '../src/app/User/userRoute';
//import table from '../src/app/Table/tableRoute';


//import express from 'express';
//import compression from 'compression';
//import methodOverride from 'method-override';

const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');

module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    
    const user = require('../src/app/User/userRoute');
    new user(app);

    const table = require('../src/app/Table/tableRoute')
    new table(app);

    return app;
};