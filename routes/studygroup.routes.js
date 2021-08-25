const sg = require("../controllers/studygroup/studygroup.controller");
const presence = require("../controllers/studygroup/precence.controller");
const video = require("../controllers/studygroup/video.controller");
const {checkUser} = require("../middleware/user.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");

const router = require('express').Router();

module.exports = app => {
    router.get('/', roleAccess(['mentor', 'student']), sg.list);
    router.post('/create', roleAccess('mentor'), sg.create);

    router.get('/presence', roleAccess('mentor'), presence.list);
    router.get('/:id/presence', roleAccess('mentor'), presence.list);
    router.put('/:id/presence/edit', roleAccess('mentor'), presence.edit);

    router.put('/:id/video/add', roleAccess('mentor'), video.add);
    router.put('/:id/video/edit', roleAccess('mentor'), video.edit);

    router.put('/:id/thumbnail/edit', roleAccess('mentor'), sg.editMedia);

    router.get('/:id', roleAccess(['mentor', 'student']), sg.list);
    router.put('/:id/edit', roleAccess('mentor'), sg.edit);
    router.delete('/:id/remove', roleAccess('mentor'), sg.remove);
    router.delete('/:id/delete', roleAccess('mentor'), sg.delete);

    app.use('/api/v1/studygroup', tokenHandler, checkUser, router);
}
