const router = require('express').Router();
const list = require('../controllers/list.controller');
const task = require('../controllers/task.controller');
const studygroup = require('../controllers/studygroup.controller');
const course = require('../controllers/course.controller');

module.exports = (app) => {
    router.get('/users', list.users);

    router.get('/role', list.role);

    router.get('/div', list.div);

    router.get('/link', list.link);

    router.get('/media', list.media);

    router.get('/status', list.status);

    router.get('/studygroup', studygroup.sg);

    router.get('/task', task.task);

    router.get('/course', course.course);

    app.use('/api/v1/list', router);
}