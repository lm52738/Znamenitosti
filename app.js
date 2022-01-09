var express = require('express');
var path = require('path');
const { auth } = require('express-openid-connect');
require('dotenv').config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL
};

var indexRouter = require('./routes/index.js');
var dataRouter = require('./routes/datatable.js');
var apiRouter = require('./routes/api.js');
var userRouter = require('./routes/user.js');

var app = express();

app.set('view engine', 'ejs');

app.use(auth(config));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use('/', indexRouter);
app.use('/datatable', dataRouter);
app.use('/api/znamenitosti', apiRouter);
app.use('/user', userRouter);

app.use((req,res) => {

    // metoda nije implementirana
    if (req.method !== "GET" && req.method !== "POST" && req.method !== "PUT" && req.method !== "DELETE") {
        
        let response = {
            "status":"501 Not Implemented",
            "message":"Method not implemented for requested resource.",
            "response":null
        }

        res.set({
            'method': req.method,
            'status':'501 Not Implemented',
            'message':'Method not implemented for requested resource.',
            'Content-type':'application/json'
        });

        res.status(501).send(response);
    }

    // metoda nije pronađena
    let response = {
        "status":"404 Not Found",
        "message":"The server cannot find the requested resource.",
        "response":null
    }
    
    res.set({
        'method': req.method,
        'status':'404 Not Found',
        'message':'The server cannot find the requested resource.',
        'Content-type':'application/json'
    });

    res.status(404).send(response);
});

module.exports = app;
