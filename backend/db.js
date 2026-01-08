const mongoose = require('mongoose')
const { Schema } = require('mongoose')

mongoose.connect('mongodb://localhost:27017/paytmData')

const userSchema = new Schema({
    email: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    password: { type: String, trim: true, min: 6 }
});

const User = mongoose.model('User', userSchema);

module.exports = User