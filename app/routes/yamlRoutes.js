'use strict'

const express = require('express');
const yaml = require('../controllers/yamlController')
const router = express.Router();
const { Validator, ValidationError } = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;

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

router.get('/', yaml.getParameters)

router.get('/:parameterId', yaml.getParameterOrValue)

router.post('/:parameterId', yaml.addParameterOrValue)

router.put('/:parameterId', validate({body: language_schema}), yaml.addTranslation)

router.delete('/:parameterId', yaml.removeParameterOrValueOrLang)

router.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(400).send({message: err.toString()});
    }
    if (err instanceof GitError) {
        return res.status(400).send({message: err.toString()});
    }
    else next(err);
});

module.exports = router;
