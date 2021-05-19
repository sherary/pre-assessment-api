const { check, validationResult, matchedData, sanitize } = require('express-validator');
const db = require('./models');

module.exports =  {
    create: [
        check('name').isLength({ min: 8, max: 32}),
        check('email').isEmail().isLength({ min: 8, max: 32 }),
        (req, res, next) => {

        if(!req.body.name) {
            res.status(402).send({
                message: 'Name cannot be empty'
            })
        } else if (!req.body.email) {
            res.status(402).send({
                message: 'Email cannot be empty'
            })
        } else {
            db.Users.findOne({
                where: {
                    email: req.body.email
                }
            })
            .then(user => {
                if(user) {
                    res.status(402).send({
                        message: 'Email already listed'
                    })
                } else {
                    next();
                }
            }
        )}}
    ],

    submit: [

        check('email').isEmail().isLength({ min: 8, max: 32}).custom(value => {
            return db.Users.findOne({
                where: {
                    email: value
                },
            })
            .then(e => {
                
                if(!e) {
                    throw new Error('Email is not listed!, please register!');
                }
            })
        }),
        check('token').isString().isLength({ min: 16, max: 16}).custom(value => {
            return db.Pre_assessments_submissions.findOne({
                where: {
                    token: value
                },
            })
            .then(t => {

                if(!t) {
                    throw new Error('Token does not exist!')
                }
            })
        }),
        check('data').isLength({ min: 8 }),
        (req, res, next) => {
            
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            }
            next();
        }
    ],
}