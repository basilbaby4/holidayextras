

const user = require('../models').User;
const Sequelize = require('Sequelize');
const Op = Sequelize.Op


const user_helper = {

    init: (req, res, next) => {
        req.response = {
            status: true,
            message: '',
            data: {}
        };
        res.header("authorization", false);
        next();
    },

    validateData: (req, res, next) => {
        var post = req.body;
        if (post.email == undefined || post.email == '') {
            req.response.status = false;
            req.response.message = 'Email is required';
            res.json(req.response);
        } else if (post.givenName == undefined || post.givenName == '') {
            req.response.status = false;
            req.response.message = 'Given Name is required';
            res.json(req.response);
        } else if (post.familyName == undefined || post.familyName == '') {
            req.response.status = false;
            req.response.message = 'Family Name is required';
            res.json(req.response);
        } else {
            next();
        }
    },

    validateUser: (req, res, next) => {
        user.count({ where: { id: req.body.id } }).then((count) => {
            if (count >= 1) {
                next();
            } else {
                req.response.status = false;
                req.response.message = 'User not exists';
                res.json(req.response);
            }
        })
    },

    checkEmailExits: (req, res, next) => {
        var post = req.body;
        let cond = { email: post.email };
        if (post.id > 0 && post.id != undefined) {
            cond.id = { [Op.ne]: post.id };
        }
        user.count({ where: cond }).then((count) => {
            if (count == 0) {
                next();
            } else {
                req.response.status = false;
                req.response.message = 'Email already exists.';
                res.json(req.response);
            }
        })
    },

    getUsers: (req, res, next) => {
        var query = req.query;
        var limit = 10;
        if (query.page == undefined) {
            query.page = 0;
        }
        var offset = query.page * limit;
        user.findAndCountAll({ offset: offset, limit: limit, attributes: { exclude: ['updated', 'deleted'] } }).then((result) => {
            req.response.data = result;
            next();
        })
    },

    createUpdateUser: (req, res, next) => {
        var post = req.body;
        let data = {
            givenName: post.givenName,
            email: post.email,
            familyName: post.familyName
        };
        if (post.id > 0 && post.id != undefined) {
            user.update(data, { where: { id: post.id } }).then((result) => {
                if (result[0] == 0) {
                    req.response.status = false;
                    req.response.message = 'User not exists';
                    res.json(req.response);
                } else {
                    req.response.message = 'User updated sccessfully';
                    next();
                }
            })
        } else {
            user.create(data).then((result) => {
                req.response.data = result;
                req.response.message = 'New User created sccessfully';
                next();
            })
        }
    },

    deleteUser: (req, res, next) => {
        var query = req.query;
        user.destroy({ where: { id: query.id } }).then((result) => {
            if (result == 1) {
                req.response.message = 'User deleted sccessfully';
                next();
            } else {
                req.response.status = false;
                req.response.message = 'User not exists';
                res.json(req.response);
            }
        })
    }
};

module.exports = user_helper;