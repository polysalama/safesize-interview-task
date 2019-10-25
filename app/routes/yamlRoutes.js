'use strict'

const express = require('express');
const yaml = require('../controllers/yamlController')
const router = express.Router();

// Setup validator
const { Validator, ValidationError } = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;

// JSON schema
let language_schema = {
    type: 'object',
    required: ['short','long'],
    properties: {
        short: {
            type: 'string',
        },
        long: {
            type: 'string',
        }
    }
}

// Routes for end points
router.get('/', yaml.getParameters)
router.get('/:parameterId', yaml.getParameterOrValue)
router.post('/:parameterId', yaml.addParameterOrValue)
router.put('/:parameterId', validate({body: language_schema}), yaml.addTranslation)
router.delete('/:parameterId', yaml.removeParameterOrValueOrLang)

// Handle JSON validation fail
router.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(400).send({message: err.toString()});
    }
});

module.exports = router;
