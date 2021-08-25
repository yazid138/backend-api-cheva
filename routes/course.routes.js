const {checkUser} = require("../middleware/user.middleware");
const {linkRequired} = require("../middleware/link.middleware");
const {infoSchema, sectionSchema, chapterSchema, glossarySchema} = require("../middleware/validation");
const {imageRequired} = require("../middleware/media.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");
const {getCourseProgress} = require("../controllers/course/courseProgress.controller");
const course = require("../controllers/course/course.controller");
const chapter = require("../controllers/course/chapter.controller");
const section = require("../controllers/course/section.controller");
const glossary = require("../controllers/course/glossary.controller");
const router = require('express').Router();

module.exports = app => {
    router.get('/', course.list);
    router.get('/progress', getCourseProgress);

    router.post('/create', roleAccess('mentor'), infoSchema, imageRequired(true), course.create);
    router.post('/chapter/create', roleAccess('mentor'), chapterSchema, chapter.create);
    router.post('/chapter/section/add', roleAccess('mentor'), sectionSchema, linkRequired(), section.add);
    router.post('/glossary/create', roleAccess('mentor'), infoSchema, glossarySchema, glossary.create);

    app.use('/api/v1/course', tokenHandler, checkUser, router);
}