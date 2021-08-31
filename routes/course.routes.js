const {checkUser} = require("../middleware/user.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");
const progress = require("../controllers/course/courseProgress.controller");
const course = require("../controllers/course/course.controller");
const chapter = require("../controllers/course/chapter.controller");
const section = require("../controllers/course/section.controller");
const glossary = require("../controllers/course/glossary.controller");
const router = require('express').Router();

module.exports = app => {
    router.get('/', course.list);

    router.get('/progress', progress.list);
    router.post('/progress/add', progress.add);

    router.post('/create', roleAccess('mentor'), course.create);
    router.get('/:id', course.list);
    router.put('/:id/edit', roleAccess('mentor'), course.edit);
    router.put('/:id/media/edit', roleAccess('mentor'), course.editMedia);
    router.delete('/:id/delete', roleAccess('mentor'), course.delete);

    router.post('/:id/glossary/create', roleAccess('mentor'), glossary.create);
    router.put('/:id/glossary/:id2/edit', roleAccess('mentor'), glossary.edit);
    router.delete('/:id/glossary/:id2/remove', roleAccess('mentor'), glossary.remove);

    router.post('/:id/chapter/create', roleAccess('mentor'), chapter.create);
    router.put('/:id/chapter/:id2/edit', roleAccess('mentor'), chapter.edit);
    router.delete('/:id/chapter/:id2/delete', roleAccess('mentor'), chapter.delete);

    router.post('/:id/chapter/:id2/section/add', roleAccess('mentor'), section.add);
    router.put('/:id/chapter/:id2/section/:id3/edit', roleAccess('mentor'), section.edit);
    router.delete('/:id/chapter/:id2/section/:id3/delete', roleAccess('mentor'), section.delete);

    app.use('/api/v1/course', tokenHandler, checkUser, router);
}