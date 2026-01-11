const JWT_SECRET = require('../config')
const jwt = require('jsonwebtoken')
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];
    // console.log(token)
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log(decoded)
        req.userid = decoded.userId;
        console.log(req.userid);
        next();
    }
    catch (err) {
        return res.status(403).json({ msg: "something is wrong" })
    }
}

module.exports = authMiddleware;