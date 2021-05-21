const Joi = require('joi');
const db = require('./models');

const checkAddUser = async (req, res, next) => {
    const schema = Joi.object().keys({

        //validating name
        name: Joi.string()
                .trim()
                .min(8)
                .max(32)
                .required()
                .error(errors =>  {
            errors.forEach(err => {
                switch(err.code) {
                    case 'any.empty':
                        err.message = 'Name cannot be empty';
                        break;
                    case 'string.min':
                        err.message = `Name should have at least ${err.local.limit} characters`;
                        break;
                    case 'string.max':
                        err.message = `Name should have maximum ${err.local.limit} characters`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),

        //validating email
        email: Joi.string()
                .trim()
                .min(10)
                .max(80)
                .email({ 
                    minDomainSegments: 2,
                    tlds: {
                        allow: ['com', 'net']
                    }
                })
                .required()
                .error(errors => {
            
                    errors.forEach(err => {
                        if(err.code === 'any.required') {
                            err.message = 'Email cannot be empty'
                        }

                    });
                    return errors;
                })
    })
    
    try {
        const value = await schema.validateAsync({
            name: req.body.name, 
            email: req.body.email,
        })

        next();

    } catch (error) {

        return res.status(402).send({
            status: 'Fail',
            message: error.message,
            data: error._original
        });
    }
}

const checkSubmission = async (req, res) => {
    const schema = Joi.object().keys({
        email: Joi.string()
                .trim()
                .min(10)
                .max(80)
                .email({ 
                    minDomainSegments: 2,
                    tlds: {
                        allow: ['com', 'net']
                    }
                })
                .required()
                .error(errors => {
            
                    errors.forEach(err => {
                        if(err.code === 'any.required') {
                            err.message = 'Email cannot be empty'
                        }

                    });
                    return errors;
                }),

        token: Joi.string()
                .trim()
                .min(16)
                .max(16)
                .required()
                .error(errors => {
                    
                    errors.forEach(err => {
                        switch (err.code) {
                            case 'any.required':
                                err.message = 'Token cannot be empty';
                                break;
                            case 'string.min':
                            case 'string.max':
                                err.message = 'Token must be 16 characters!';
                                break;
                            default: 
                                break;
                        }
                    });
                    return errors;
                }),   
    });

    try {
        const value = await schema.validateAsync({
            email: req.body.email,
            token: req.body.token,
        });

        return res.status(200).send('OK');

    } catch (error) {
        return res.status(402).send({
            status: 'Fail',
            message: error.message,
            data: error._original
        });
    }
}
module.exports =  { checkAddUser, checkSubmission };