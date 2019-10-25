'use strict'

const Git = require("nodegit");
const GitSignature = Git.Signature.create('Node app', 'node@node.app',
    new Date().getTime(),
    new Date().getTimezoneOffset())
Git.Repository.init('.', 0).then(function (repo) { 
    Git.Repository.open('.').then(function (repo) {
        repo.createCommitOnHead(['Prevodi.yaml'], GitSignature, GitSignature, 'Updated at' + new Date().toISOString())
    })
})
const fs = require('fs')
const YAML = require('yaml')
const yaml_file = fs.readFileSync('./Prevodi.yaml', 'utf8')

class ParameterMissingError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ParameterMissingError'
    }
}

class ValueMissingError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ValueMissingError'
    }
}

class LanguageMissingError extends Error {
    constructor(message) {
        super(message)
        this.name = 'LanguageMissingError'
    }
}

const Yaml = {
    yaml_object: YAML.parse(yaml_file),

    save_to_file() {
        if (Object.keys(this.yaml_object).length == 0) {
            fs.writeFileSync('./Prevodi.yaml', '')
        } else {
            fs.writeFileSync('./Prevodi.yaml', YAML.stringify(this.yaml_object))
        }
        Git.Repository.open('.').then(function (repo) {
            repo.createCommitOnHead(['Prevodi.yaml'], GitSignature, GitSignature, 'Updated at' + new Date().toISOString())
        })
    },

    parameter_exists(parameter_id, throw_error = false) {
        if (this.yaml_object && parameter_id in this.yaml_object) {
            return true
        }
        if (throw_error) {
            throw new ParameterMissingError('No such parameter.')
        }
        return false
    },

    value_exists(parameter_id, value_id, throw_error = false) {
        let param = this.get_parameter(parameter_id)
        if ('values' in param &&
            param['values'] != null &&
            param['values'] != '' &&
            value_id in param['values']) {
            return true
        }
        if (throw_error) {
            throw new ValueMissingError('No such value.')
        }
        return false
    },

    parameter_lang_exists(parameter_id, lang_id, throw_error = false) {
        let param = this.get_parameter(parameter_id)
        if ('langs' in param &&
            param['langs'] != null &&
            param['langs'] != '' &&
            lang_id in param['langs']) {
            return true
        }
        if (throw_error) {
            throw new LanguageMissingError('No such language.')
        }
        return false
    },

    value_lang_exists(parameter_id, value_id, lang_id, throw_error = false) {
        let value = this.get_parameter_value(parameter_id, value_id)
        if ('langs' in value &&
            value['langs'] != null &&
            value['langs'] != '' &&
            lang_id in value['langs']) {
            return true
        }
        if (throw_error) {
            throw new LanguageMissingError('No such language.')
        }
        return false
    },

    get_parameters() {
        let r_val = []
        if (this.yaml_object) {
            r_val = Object.keys(this.yaml_object)
        }
        return r_val
    },

    get_parameter(parameter_id) {
        if (this.parameter_exists(parameter_id, true)) {
            return this.yaml_object[parameter_id]
        }
    },

    get_parameter_value(parameter_id, value_id) {
        if (this.value_exists(parameter_id, value_id, true)) {
            return this.yaml_object[parameter_id]['values'][value_id]
        }
    },

    add_parameter(parameter_id) {
        if (this.parameter_exists(parameter_id)) {
            return parameter_id
        }
        this.yaml_object[parameter_id] = { langs: '', values: '' }
        this.save_to_file()
        return parameter_id
    },

    add_parameter_value(parameter_id, value_id) {
        if (this.value_exists(parameter_id, value_id)) {
            return [parameter_id, value_id]
        }
        let values = this.yaml_object[parameter_id]['values']
        if (values == null || values == '') {
            this.yaml_object[parameter_id]['values'] = { [`${value_id}`]: { langs: '' } }
        } else {
            this.yaml_object[parameter_id]['values'][value_id] = { langs: '' }
        }
        this.save_to_file()
        return [parameter_id, value_id]

    },

    add_parameter_lang(parameter_id, lang_id, translation) {
        if (this.parameter_lang_exists(parameter_id, lang_id)) {
            this.yaml_object[parameter_id]['langs'][lang_id] = translation
        } else {
            let langs = this.yaml_object[parameter_id]['langs']
            if (langs == null || langs == '') {
                this.yaml_object[parameter_id]['langs'] = { [`${lang_id}`]: translation }
            } else {
                this.yaml_object[parameter_id]['langs'][lang_id] = translation
            }
        }
        this.save_to_file()
        return parameter_id
    },

    add_value_lang(parameter_id, value_id, lang_id, translation) {
        if (this.value_lang_exists(parameter_id, value_id, lang_id)) {
            this.yaml_object[parameter_id]['values'][value_id]['langs'][lang_id] = translation
        } else {
            let value = this.yaml_object[parameter_id]['values'][value_id]['langs']
            if (value == null || value == '') {
                this.yaml_object[parameter_id]['values'][value_id]['langs'] = { [`${lang_id}`]: translation }
            } else {
                this.yaml_object[parameter_id]['values'][value_id]['langs'][lang_id] = translation
            }
        }
        this.save_to_file()
        return [parameter_id, value_id]
    },

    remove_parameter(parameter_id) {
        if (this.parameter_exists(parameter_id, true)) {
            delete this.yaml_object[parameter_id]
            this.save_to_file()
        }
        return parameter_id
    },

    check_empty(item) {
        return Object.keys(item).length == 0
    },

    remove_value(parameter_id, value_id) {
        if (this.value_exists(parameter_id, value_id, true)) {
            delete this.yaml_object[parameter_id]['values'][value_id]
            if (this.check_empty(this.yaml_object[parameter_id]['values'])) {
                this.yaml_object[parameter_id]['values'] = ''
            }
            this.save_to_file()
        }
        return [parameter_id, value_id]
    },

    remove_parameter_lang(parameter_id, lang_id) {
        if (this.parameter_lang_exists(parameter_id, lang_id, true)) {
            delete this.yaml_object[parameter_id]['langs'][lang_id]
            if (this.check_empty(this.yaml_object[parameter_id]['langs'])) {
                this.yaml_object[parameter_id]['langs'] = ''
            }
            this.save_to_file()
        }
        return parameter_id
    },

    remove_value_lang(parameter_id, value_id, lang_id) {
        if (this.value_lang_exists(parameter_id, value_id, lang_id, true)) {
            delete this.yaml_object[parameter_id]['values'][value_id]['langs'][lang_id]
            if (this.check_empty(this.yaml_object[parameter_id]['values'][value_id]['langs'])) {
                this.yaml_object[parameter_id]['values'][value_id]['langs'] = ''
            }
            this.save_to_file()
        }
        return [parameter_id, value_id]
    }
}

module.exports = Yaml
