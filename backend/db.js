const mongoose = require('mongoose')
const { Schema } = require('mongoose')

mongoose.connect('mongodb+srv://gauravmehra920:drake%402003@gauravcluster.olubxtl.mongodb.net/paytmData', { family: 4 })

const userSchema = new Schema({
    email: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    password: { type: String, trim: true, min: 6 }
});

const bankSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
const Bank = mongoose.model('Bank', bankSchema);
module.exports = { User, Bank };