const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const zod = require('zod');
const { User, Bank } = require('../db')
const JWT_KEY = require('../config');
const authMiddleware = require('./middleware');
const { id } = require('zod/v4/locales');
const userSchema = zod.object({
    email: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string().min(6)
})


router.post('/signup', async (req, res) => {

    const bodyData = req.body;
    const result = userSchema.safeParse(bodyData);
    if (!result.success) {
        return res.status(411).json({
            msg: "invalid signup data!"
        })
    }

    const check = await User.findOne({ email: bodyData.email })
    if (check) {
        return res.send({ msg: "email already exists!" });
    }
    try {
        const newUser = await User.create({ email: bodyData.email, firstName: bodyData.firstname, lastName: bodyData.lastname, password: bodyData.password });
        const userId = newUser._id;
        await Bank.create({ userId: userId, balance: 1 + Math.random() * 1000 });
        const token = jwt.sign({ userId }, JWT_KEY);
        return res.status(200).json({
            newUser,
            token,
            msg: "User Created Successfully!"
        })

    } catch (err) {
        return res.status(500).json({
            err
        })
    }
})


router.post('/signin', async (req, res) => {

    const bodyData = req.body;
    const result = userSchema.safeParse(bodyData);
    if (!result.success) {
        return res.status(411).json({
            msg: "invalid log in data"
        })
    }
    const user = await User.findOne({
        email: bodyData.email,
        password: bodyData.password
    })
    if (user) {
        const token = jwt.sign({
            userId: user._id,
        }, JWT_KEY);
        res.json({
            token: token
        })
        return;
    }
    return res.status(411).json({
        message: "error while logging in!"
    })
});


router.put('/update', authMiddleware, async (req, res) => {
    const new_password = req.body.password;
    const new_firstname = req.body.firstname;
    const new_lastname = req.body.lastname;
    const email = req.body.email;

    const check = await User.findOne({ email: email });
    if (!check) {
        return res.status(411).json({
            msg: "invalid email"
        })
    }
    const newUser = await User.findOneAndUpdate({ email: email }, { firstName: new_firstname, lastName: new_lastname, password: new_password }, { new: true });
    return res.status(200).json({
        newUser
    })
})



module.exports = router