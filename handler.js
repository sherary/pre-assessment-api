const db = require('./models');
const {nanoid} = require('nanoid');

const Handler = class {
    async all(req, res) {
        db.model('preassessment_backend_submissions').findAll()
            .then(users => res.send(users))
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

        db.model('users').findOne({
            where: {
                email: newUser.email,
            },
            attributes: ['id', 'name', 'email']
        })
        .then(result => {

            if(result === null) {
                createUser();
            } else {
                return res.status(402).send('Email already listed!')
            }
        })       
    }

    async submit(req, res) {
        const data = {
            data: req.body.data
        }

        const userData = [];

        db.model('users').findOne({
            where: {
                email: req.body.email
            },
            attributes: ['id', 'email']
        }).then(result => {
            userData.push(result.dataValues);
        })

        db.model('preassessment_backend_submissions').findOne({
            where: {
                token: req.body.token
            },
            attributes: ['user_id', 'token', 'data']
        }).then(result => {

            if(result.user_id !== userData[0].id) {
                return res.status(402).send('Token and email does not match!')
            }

            if(result.data !== null) {
                return res.status(402).send('You have already submitted the assignment')    
            }
                    
            db.model('preassessment_backend_submissions').update(data, {
                where: {
                    token: req.body.token
                },
                attributes: ['data']
            }).then(
                res.status(200).json({
                    status: 'Success',
                    message: 'Assigment submitted',
                })
            )

        })
    };

    async one(req, res) {
        db.Pre_assessments_submissions.findOne({
            where: {
                user_id: req.body.user_id,
            },
            attributes: ['user_id', 'token', 'data'],
            include: [{
                models: Users,
                attributes: ['id', 'email']
            }]
        })
        .then(result => {
            console.log(result)
            res.send(result);
        })
    }

}

module.exports = new Handler;