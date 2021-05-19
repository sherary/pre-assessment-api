const db = require('./models');
const {nanoid} = require('nanoid');

const Handler = class {
    async all(req, res) {
        db.Pre_assessments_submissions.findAll()
            .then(users => res.send(users))
    }

    async create(req, res) {

        const token = nanoid(16)
        const data = [];
        const newUser = {
            name: req.body.name,
            email: req.body.email,
        }

        db.Users.create(newUser)
            .then(result => {
                const id = result.id;

                data.push(newUser.email)

                db.Pre_assessments_submissions.create({
                    user_id: id,
                    token: token
                })
                .then(result => {

                    data.push(result.user_id, result.token)
                    
                    db.Users.findOne({
                        where: {
                            email: req.body.email,
                        },
                        attributes: ['id', 'email']
                    })
                    .then(user => {

                        if(user.id !== data.user_id) {
                            res.status(500).send({
                                message: 'Fail'
                            })
                        }
                        return res.status(200).send({
                            status: 'Success',
                            data: {
                                user_id: data.user_id,
                                email: data.email,
                                token: data.token,
                            }
                        })
                    })

                    
                })
        })
        
    }

    async submit(req, res) {
        const data = {
            data: req.body.data
        }

        db.Pre_assessments_submissions.findOne({
            where: {
                token: req.body.token
            },
            attributes: ['user_id', 'token', 'data']
        }).then(result => {
            
            if(result.data !== null) {
                return res.status(402).send('You have already submitted the assignment')    
            }

            return db.Pre_assessments_submissions.update(data, {
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

}


module.exports = new Handler;