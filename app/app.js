'use strict'
const config_json = require('./config/config.json')
const express = require('express');
const routes = require('./routes/yamlRoutes')
const bodyParser = require('body-parser')
const app = express()

const port = config_json['app_port']

// Handles malformed JSON
app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            return res.status(400).send({ message: 'Cant parse, bad JSON.' })
        }
        next();
    })
})

// Handles routes
app.use('/', routes);

// Handles bad url
app.use(function(req, res) {
    res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});

// Handles internal errors
app.use(function(err, req, res, next) {
    res.status(500).send({ message: err.toString() });
});

app.listen(port, () => console.log(`App listening on port ${port}!`))
