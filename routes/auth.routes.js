const {imageRequired} = require("../middleware/media.middleware");
const router = require('express').Router();

const {
    loginSchema,
    userSchema,
    profileSchema
} = require("../middleware/validation");
const {login, register} = require("../controllers/auth.controller");

module.exports = (app) => {
    router.post('/login', loginSchema, login);

    router.post('/register', userSchema, profileSchema, imageRequired(false), register);

    app.use('/api/v1/auth', router);
}