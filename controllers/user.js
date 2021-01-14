const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const config = require('../config/config')
const promisify = require('util').promisify;

const signToken = promisify(jwt.sign);

const {jwtSecret, authCookieName} = config;

module.exports = {
    getRegister(req, res) {
        res.render('register');
    },

    postRegister(req, res, next) {
        const { username, password } = req.body;
        userModel.create({ username, password })
            .then(user => {
                return signToken({ userId: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
            })
            .then(jwtToken => {
                res.cookie(authCookieName, jwtToken, { httpOnly: true });
                res.redirect('/')
            })
            .catch(next)
    },

    postLogin(req, res, next) {
        const { username } = req.body;
        
        userModel.findOne({ username })
            .then(user => {
                return signToken({ userId: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
            })
            .then(jwtToken => {
                res.cookie(authCookieName, jwtToken, { httpOnly: true });
                res.redirect('/')
            })
            .catch(next)
    },

    getLogin(req, res) {
        res.render('login');
    },

    getLogout(req, res) {
        res.clearCookie(authCookieName);
        res.redirect('/');
    }
};