const {responseMessage} = require('../utils/responseHandler');

const jwt = require('jsonwebtoken');

exports.tokenHandler = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token == null) {
        responseMessage(res, 401, 'gak ada token');
        return;
    }

    jwt.verify(token, 'rahasia', (err, data) => {
        if (err) {
            responseMessage(res, 403, 'Forbidden Invalid Token');
            return;
        }

        req.authData = data;
        next();
    })
}