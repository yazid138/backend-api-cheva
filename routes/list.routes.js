const router = require('express').Router();

const list = require('../controllers/list.controller');
const sg = require('../controllers/studygroup/studygroup.controller');

module.exports = (app) => {
    router.get('/users', list.getUser);

    router.get('/role', list.getRole);

    router.get('/link', list.getLink);

    router.get('/media', list.getMedia);

    router.get('/status', list.getStatus);

    router.get('/studygroup', sg.list);

    app.use('/api/v1/list', router);
}