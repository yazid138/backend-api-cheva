const router = require('express').Router();
const list = require('../controllers/list.controller');

module.exports = (app) => {
    router.get('/users', list.users);

    router.get('/role', list.role);

    router.get('/div', list.div);

    router.get('/link', list.link);

    router.get('/media', list.media);

    app.use('/api/v1/list', router);
}