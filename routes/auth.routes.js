const router = require('express').Router();
const {login, register} = require("../controllers/auth.controller");

module.exports = (app) => {
    router.post('/login', login);

    router.post('/register', register);

    app.use('/api/v1/auth', router);
}