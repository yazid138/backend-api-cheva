const router = require('express').Router();

const list = require('../controllers/list.controller');
const studygroup = require('../controllers/studygroup/studygroup.controller');

module.exports = (app) => {
    router.get('/users', list.getUsers);

    router.get('/role', list.getRole);

    router.get('/div', list.getDiv);

    router.get('/link', list.getLink);

    router.get('/media', list.getMedia);

    router.get('/status', list.getStatus);

    router.get('/studygroup', studygroup.getStudyGroup);

    app.use('/api/v1/list', router);
}