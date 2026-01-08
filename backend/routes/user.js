const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const zod = require('zod');
const User = require('../db')

const userSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
})


router.post('singup', async (req, res) => {

    const bodyData = req.body;
    const check = userSchema.parse(bodyData);
    if (!check) {
        res.send(401).json({
            msg: "invalid singup data!"
        })
    }

})



module.exports = router