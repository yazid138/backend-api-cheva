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

    router.post('/create', tokenHandler, checkUser, roleAccess('mentor'), infoSchema, sgSchema, imageRequired(), createStudyGroup);

    router.get('/:id', tokenHandler, checkUser, roleAccess(['mentor', 'student']), getStudyGroup);
    router.put('/:id/edit', tokenHandler, checkUser, roleAccess('mentor'), editStudyGroup);
    router.delete('/:id/remove', tokenHandler, checkUser, roleAccess('mentor'), removeStudyGroup);

    router.get('/:id/presence', tokenHandler, checkUser, roleAccess('mentor'), getPresence);
    router.put('/:id/presence/edit', tokenHandler, checkUser, roleAccess('mentor'), updatePresenceSchema, updatePresence);

    router.put('/:id/video/add', tokenHandler, checkUser, roleAccess('mentor'), addVideoStudyGroup);
    router.put('/:id/video/edit/', tokenHandler, checkUser, roleAccess('mentor'), editVideoStudyGroup);

    app.use('/api/v1/studygroup', router);
}