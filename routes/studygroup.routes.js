const {editMediaStudyGroup} = require("../controllers/studygroup/studygroup.controller");
const {checkUser} = require("../middleware/user.middleware");
const {
    infoSchema,
    sgSchema,
    updatePresenceSchema
} = require("../middleware/validation");
const {
    createStudyGroup,
    getStudyGroup,
    editStudyGroup,
    removeStudyGroup,
    editVideoStudyGroup,
    addVideoStudyGroup,
} = require("../controllers/studygroup/studygroup.controller");
const {getPresence, updatePresence} = require("../controllers/studygroup/precence.controller");
const {linkRequired} = require("../middleware/link.middleware");
const {imageRequired} = require("../middleware/media.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");

const router = require('express').Router();

module.exports = app => {
    router.get('/', tokenHandler, checkUser, roleAccess(['mentor', 'student']), getStudyGroup);
    router.get('/presence', tokenHandler, checkUser, roleAccess('mentor'), getPresence);

    router.post('/create', tokenHandler, checkUser, roleAccess('mentor'), createStudyGroup);

    router.get('/:id', tokenHandler, checkUser, roleAccess(['mentor', 'student']), getStudyGroup);
    router.get('/:id/presence', tokenHandler, checkUser, roleAccess('mentor'), getPresence);

    router.put('/:id/add/video', tokenHandler, checkUser, roleAccess('mentor'), addVideoStudyGroup);

    router.put('/:id/edit', tokenHandler, checkUser, roleAccess('mentor'), editStudyGroup);
    router.put('/:id/edit/thumbnail', tokenHandler, checkUser, roleAccess('mentor'), editMediaStudyGroup);

    router.put('/:id/edit/presence', tokenHandler, checkUser, roleAccess('mentor'), updatePresenceSchema, updatePresence);
    router.put('/:id/edit/video', tokenHandler, checkUser, roleAccess('mentor'), editVideoStudyGroup);

    router.delete('/:id/remove', tokenHandler, checkUser, roleAccess('mentor'), removeStudyGroup);

    app.use('/api/v1/studygroup', router);
}