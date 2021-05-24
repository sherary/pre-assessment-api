const db = require('../models');
const {nanoid} = require('nanoid');

const Handler = class {

    async one(req, res) {
        await db.model('users').findOne({
            where: {
                email: req.params.email
            },
            include: [{
                model: db.model('preAssessmentBackendSubmissions'),
                as: 'preassessment_backend_submissions',
                attributes: ['user_id', 'token', 'data'],
            }],
            attributes: ['id', 'email'],
            raw: true,
        })
        .then(result => {
            
            return res.status(200).json({
                status: 'Success',
                data: {
                    user_id: result["preassessment_backend_submissions.user_id"],
                    email: result.email,
                    token: result["preassessment_backend_submissions.token"],
                    submitted_assessment: result["preassessment_backend_submissions.data"],
                }
            })
        })
    }

    async create(req, res) {

        const token = nanoid(16)
        const data = [];
        const newUser = {
            name: req.body.name,
            email: req.body.email,
        }

        const createUser = () => {
            db.model('users').create(newUser)
                .then(result => {
                    data.push(result.dataValues);

                    db.model('preAssessmentBackendSubmissions').create({
                        user_id: data[0].id,
                        token: token,
                    })
                        .then(result => {
                            data[0].token = result.token
                            return res.status(200).json({
                                status: 'Success',
                                data: data,
                            })
                        })
                })
        }

        await db.model('users').findOne({
            where: {
                email: newUser.email,
            },
            attributes: ['id', 'name', 'email'],
            raw: true
        })
        .then(result => {
            
            if(result === null) {
                createUser();
            } else {
                db.model('preAssessmentBackendSubmissions').findOne({
                    where: {
                        user_id: result.id
                    },
                    attributes: ['id', 'token'],
                    raw: true
                })
                .then(result => {

                    return res.status(402).send({
                        message: 'Email already listed!',
                        data: result
                    })
                })
            }
        })       
    }

    async submit(req, res) {
        const data = {
            data: req.body.data
        }

        await db.model('users').findOne({
            attributes: ['id', 'email'],
            include: 
                [{
                    model: db.model('preAssessmentBackendSubmissions'),
                    as: 'preassessment_backend_submissions',
                    attributes: ['user_id', 'token', 'data'],
                    where: {
                        token: req.body.token
                    }
                }],
            raw: true,
        }).then(result => {

            if(req.body.email !== result.email) {
                return res.status(400).send('Email and token does not match');
            }
            
            if(result['preassessment_backend_submissions.data'] === null) {
                db.model('preAssessmentBackendSubmissions').update(data, {
                    where: {
                        token: req.body.token
                    },
                    attributes: ['data'],
                })
                .then(result => {

                    return res.status(200).json({
                        status: 'Success',
                        message: 'Assignment updated!',
                    })
                })
            } else {
                return res.status(400).send('You have already submitted the assignment before!')
            }
        }).catch(error => {
            console.error(error)

            return res.status(500).send('Internal Error');
        })

    };
}

module.exports = new Handler;