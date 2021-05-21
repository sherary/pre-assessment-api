const express = require('express');
const app = express();
const routes = require('./routes');
const db = require('./models');

//parsing application/json
app.use(express.json());

//parsing body from x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })) 

//parsing multipart/form-data
app.use(express.static('public'));

//route to 🚀
app.use('/', routes)

//PORT
const port = process.env.PORT || 3000

db.sync().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server run on port ${port} 🚀`);
    });
})

module.exports = app;
