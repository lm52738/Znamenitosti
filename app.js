var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index.js');
var dataRouter = require('./routes/datatable.js');
var apiRouter = require('./routes/api.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/datatable', dataRouter);
app.use('/api/znamenitosti', apiRouter);

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
