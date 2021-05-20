const db = require('./models');
const {nanoid} = require('nanoid');

const Handler = class {
    async all(req, res) {
        db.preassessment_backend_submissions.findAll()
            .then(users => res.send(users))
    }

    async create(req, res) {

        const token = nanoid(16)
        const data = [];
        const newUser = {
            name: req.body.name,
            email: req.body.email,
        }

        db.model('users').create(newUser)
            .then(result => {
                const id = result.id;

                data.push(newUser.email)

                db.model('preassessment_backend_submissions').create({
                    user_id: id,
                    token: token
                })
                .then(result => {

                    data.push(result.user_id, result.token)

                    db.model('users').findOne({
                        where: {
                            email: newUser.email
                        },
                        attributes: ['id', 'email']
                    }).then(result => {
                        if(result.id == data[1] &&  result.email == data[0]) {
                            return res.status(200).send({
                                status: 'Success',
                                data: {
                                    email: data[0],
                                    user_id: data[1],
                                    token: data[2],
                                }
                            })
                        }
                    })                   
                })
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