const {checkUser} = require("../middleware/user.middleware");
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

    router.post('/create', roleAccess('mentor'), course.create);

    router.post('/:id/glossary/create', roleAccess('mentor'), glossary.create);
    router.put('/:id/glossary/edit', roleAccess('mentor'), glossary.create);
    router.delete('/:id/glossary/delete', roleAccess('mentor'), glossary.create);

    router.post('/:id/chapter/create', roleAccess('mentor'), chapter.create);
    router.put('/:id/chapter/edit', roleAccess('mentor'), chapter.create);
    router.delete('/:id/chapter/delete', roleAccess('mentor'), chapter.create);

    router.post('/:id/chapter/:id2/section/add', roleAccess('mentor'), section.add);
    router.put('/:id/chapter/:id2/section/edit', roleAccess('mentor'), section.add);
    router.delete('/:id/chapter/:id2/section/delete', roleAccess('mentor'), section.add);

    router.get('/:id', course.list);
    app.use('/api/v1/course', tokenHandler, checkUser, router);
}