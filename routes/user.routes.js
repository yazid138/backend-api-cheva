const {checkUser} = require("../middleware/user.middleware");
const {tokenHandler} = require("../middleware/tokenValidation");
const user = require('../controllers/user.controller');

const router = require('express').Router();

module.exports = app => {
    router.get('/', user.detail);
    router.put('/edit', user.edit);
    router.put('/thumbnail/edit', user.editMedia);
    router.put('/password/edit', user.editPassword);

    app.use('/api/v1/user', tokenHandler, checkUser, router);
}
