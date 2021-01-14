const mongoose = require('mongoose');
const config = require('../config/config');

module.exports = (connectionString) => {
    return mongoose.connect(config.dbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('DB connected');
    });
}