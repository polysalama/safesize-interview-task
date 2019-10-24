'use strict'
const config_json = require('./config/config.json')
const express = require('express');
const routes = require('./routes/yamlRoutes')
const bodyParser = require('body-parser')
const app = express()

const port = config_json['app_port']

app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            return res.status(400).send({ message: 'Cant parse, bad JSON.' })
        }
        next();
    })
})

app.use('/', routes);
app.use(function(req, res) {
    res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});
app.use(function(err, req, res, next) {
    res.status(500).send({ message: err.toString() });
});

app.listen(port, () => console.log(`App listening on port ${port}!`))
