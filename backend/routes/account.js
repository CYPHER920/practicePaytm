const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const { Bank } = require('../db')
const authMiddleware = require('./middleware')
router.get('/balance', authMiddleware, async (req, res) => {
    const userId = req.userid;
    const check = await Bank.findOne({ userId: userId });
    if (!check) {
        return res.status(411).json({
            msg: "invalid user"
        })
    }
    return res.status(200).json({
        balance: check.balance
    })
});

router.put('/sendMoney', authMiddleware, async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    const amount = req.body.amount;
    const senderId = req.userid;
    // console.log(req)
    const receiverId = req.body.receiverId;
    const account = await Bank.findOne({ userId: senderId }).session(session);
    // console.log(account.balance);
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "insufficient balance!"
        })
    }
    const check = await Bank.findOne({ userId: receiverId }).session(session);
    if (!check) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "invalid account"
        })
    }
    await Bank.updateOne({ userId: senderId }, { $inc: { balance: -amount } });
    await Bank.updateOne({ userId: receiverId }, { $inc: { balance: amount } });
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
        msg: "amount update sucessfully"
    })

});

module.exports = router