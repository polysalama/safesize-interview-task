'use strict'

const Yaml = require('../models/yamlModel');

// Functions are tied to url endpoints
// Dependant on the endpoint and url queries
// different functions are called from yamlModel

exports.getParameters = async (req, res) => {
    try {
        res.send(Yaml.get_parameters())
    } catch (err) {
        res.status(400).send({ message: err.toString() })
    }
};

exports.getParameterOrValue = async (req, res) => {
    try {
        let param_id = req.params.parameterId
        let value_id = req.query.value
        let num_of_query_params = Object.keys(req.query).length
        if (num_of_query_params == 1 && typeof value_id != 'undefined') {
            let values = Yaml.get_parameter_value(param_id, value_id)
            res.send({ [`${value_id}`]: values })
        } else if (num_of_query_params == 0) {
            let param = Yaml.get_parameter(param_id)
            res.send({ [`${param_id}`]: param })
        } else {
            res.status(400).send({ message: 'Bad url query.' })
        }
    } catch (err) {
        res.status(400).send({ message: err.toString() })
    }
};

exports.addParameterOrValue = async (req, res) => {
    try {
        let param_id = req.params.parameterId
        let value_id = req.query.value
        let num_of_query_params = Object.keys(req.query).length
        if (num_of_query_params == 1 && typeof value_id != 'undefined' && value_id != '') {
            let [param, value] = Yaml.add_parameter_value(param_id, value_id)
            res.send({ paramter_id: param, value_id: value })
        } else if (num_of_query_params == 0) {
            let param = Yaml.add_parameter(param_id)
            res.send({ parameter_id: param })
        } else {
            res.status(400).send({ message: 'Bad url query.' })
        }
    } catch (err) {
        res.status(400).send({ message: err.toString() })
    }
};

exports.addTranslation = async (req, res) => {
    try {
        let param_id = req.params.parameterId
        let value_id = req.query.value
        let lang_id = req.query.lang
        let num_of_query_params = Object.keys(req.query).length
        if (num_of_query_params != 0 && typeof lang_id != 'undefined' && lang_id != '') {
            if (num_of_query_params == 2 && typeof value_id != 'undefined' && value_id != '') {
                let [param, value] = Yaml.add_value_lang(param_id, value_id, lang_id, req.body)
                res.send({ paramter_id: param, value_id: value })
                
            } else if (num_of_query_params == 1) {
                let param = Yaml.add_parameter_lang(param_id, lang_id, req.body)
                res.send({ paramter_id: param })
            }
        } else {
            res.status(400).send({ message: 'Bad url query.' })
        }
    } catch (err) {
        res.status(400).send({ message: err.toString() })
    }
}

exports.removeParameterOrValueOrLang = async (req, res) => {
    try {
        let param_id = req.params.parameterId
        let value_id = req.query.value
        let lang_id = req.query.lang
        let num_of_query_params = Object.keys(req.query).length
        if (typeof value_id != 'undefined' && value_id != '') {
            if (num_of_query_params == 2 && typeof lang_id != 'undefined' && lang_id != '') {
                let [param, value] = Yaml.remove_value_lang(param_id, value_id, lang_id)
                res.send({ paramter_id: param, value_id: value })
            } else if (num_of_query_params == 1){
                let [param, value] = Yaml.remove_value(param_id, value_id)
                res.send({ paramter_id: param, value_id: value })
            }
        } else if (num_of_query_params == 1 && typeof lang_id != 'undefined' && lang_id != '') {
            let param = Yaml.remove_parameter_lang(param_id, lang_id)
            res.send({ parameter_id: param })
        } else if (num_of_query_params == 0) {
            let param = await Yaml.remove_parameter(param_id)
            res.send({ parameter_id: param })
        } else {
            res.status(400).send({ message: 'Bad url query.' })
        }
    } catch (err) {
        res.status(400).send({ message: err.toString() })
    }
}
