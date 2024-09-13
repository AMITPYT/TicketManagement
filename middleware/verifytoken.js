// const jwt = require('jsonwebtoken');
// const SECRET_KEY = 'Amitisagoodb$oy'; // Use the secret key you've defined

// function verifyToken(req, res, next) {
//     const token = req.headers['authorization']?.split(' ')[1];

//     console.log(token);
//     if (!token) {
//         return res.status(403).json({ message: 'No token provided' });
//     }

//     jwt.verify(token, SECRET_KEY, (err, decoded) => {
//         if (err) {
//             console.log(err);
//             return res.status(401).json({ message: 'Failed to authenticate token' });
//         }

//         // If token is valid, proceed with request
//         req.userId = decoded.id;
//         next();
//     });
// }

// module.exports = { verifyToken };


const jwt = require('jsonwebtoken');
const User = require('../models/auth'); // Adjust the path as needed

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'Token required' });

    jwt.verify(token, 'Amitisagoodb$oy', async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        const foundUser = await User.findByPk(user.userId);
        if (!foundUser) return res.status(401).json({ message: 'User not found' });

        req.userId = user.userId;
        req.user = foundUser;
        next();
    });
};

module.exports = {verifyToken};
