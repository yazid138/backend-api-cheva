const {getCourseProgress} = require("../controllers/course/courseProgress.controller");
const {getCourse} = require("../controllers/course/course.controller");
const router = require('express').Router();

module.exports = app => {
    router.get('/', getCourse);

    router.get('/progress', getCourseProgress);

    app.use('/api/v1/course', router);
}