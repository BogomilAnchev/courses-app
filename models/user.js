const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 20,
    },
    enrolledCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'course'}]
});

userSchema.pre('save', function (done) {
    const user = this;

    if (!user.isModified('password')) {
        done();
        return;
    }
    bcrypt.genSalt(config.saltRounds, (err, salt) => {
        if (err) { done(err); return; }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { done(err); return; }
            user.password = hash;
            done();
        });
    });
});

module.exports = new mongoose.model('user', userSchema);