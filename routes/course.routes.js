const {addSection} = require("../controllers/course/course.controller");
const {sectionSchema} = require("../middleware/validation");
const {linkRequired} = require("../middleware/link.middleware");
const {createChapter} = require("../controllers/course/course.controller");
const {chapterSchema} = require("../middleware/validation");
const {createGlossary} = require("../controllers/course/course.controller");
const {glossarySchema} = require("../middleware/validation");
const {infoSchema} = require("../middleware/validation");
const {imageRequired} = require("../middleware/media.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");
const {createCourse} = require("../controllers/course/course.controller");
const {getCourseProgress} = require("../controllers/course/courseProgress.controller");
const {getCourse} = require("../controllers/course/course.controller");
const router = require('express').Router();

module.exports = app => {
    router.get('/', getCourse);
    router.get('/progress', getCourseProgress);

    router.post('/create', tokenHandler, roleAccess('mentor'), infoSchema, imageRequired(true), createCourse);
    router.post('/chapter/create', tokenHandler, roleAccess('mentor'), chapterSchema, createChapter);
    router.post('/chapter/section/add', tokenHandler, roleAccess('mentor'), sectionSchema, linkRequired(), addSection);
    router.post('/glossary/create', tokenHandler, roleAccess('mentor'), infoSchema, glossarySchema, createGlossary);

    app.use('/api/v1/course', router);
}