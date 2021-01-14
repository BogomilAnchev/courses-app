const { body } = require('express-validator');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

const repeatPasswordCheck = body('repeatPassword')
    .custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords do not match!')
        }
        return true;
    })
    .isLength({ min: 5 })
    .withMessage('The password should be at least 5 characters long')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('The password should consist only english letters and digits.')

const checkUsername = body('username')
    .custom((value, { req }) => {
        return userModel.findOne({ username: value }).then(user => {
            if (user) { return Promise.reject('This username allready exists!'); }
        });
    })
    .isLength({ min: 5 })
    .withMessage('The username should be at least 5 characters long.')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('The username should consist only english letters and digits.')


const checkLogin = body('username')
    .isLength({ min: 5 })
    .withMessage('The username should be at least 5 characters long and should consist only english letters and digits')
    .custom(async (value, { req }) => {
        const user = await userModel.findOne({ username: value });
        if (!user) throw new Error('No such username');

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) throw new Error('Invalid passwords')
        return true
    })

module.exports = {
    repeatPasswordCheck,
    checkUsername,
    checkLogin,
}