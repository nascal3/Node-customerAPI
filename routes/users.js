const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const {Users} = require('../models/users');
const _ = require('lodash');
const express = require('express');
const router = express.Router();


router.get('/me', auth, async (req, res) => {
    try {
        const user = await Users.findById(req.user._id).select('-password');
        res.send(user);
    }catch (e) {
        res.send(e.message);
    }

});

router.post('/', async (req, res) => {

    try {
        let user = await Users.findOne({email: req.body.email});
        if (user) return res.status(400).send('the following user already exists');

        user = new Users(_.pick(req.body, ['name', 'email', 'password']));

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token  = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']));
    }catch (e) {
        res.send(e.message);
    }
});

router.get('/', auth, async (req, res) => {

    try {
       const users = await Users.find().sort('name');
       res.send(users);
    }catch (e) {
        res.send(e.message);
    }
});

module.exports = router;