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
    router.get('/', tokenHandler, roleAccess(['mentor', 'student']), getStudyGroup);
    router.get('/presence', tokenHandler, roleAccess(['mentor', 'student']), getPresence);

    router.post('/create', tokenHandler, roleAccess('mentor'), infoSchema, sgSchema, imageRequired(), createStudyGroup);

    router.get('/:id', tokenHandler, roleAccess(['mentor', 'student']), getStudyGroup);
    router.put('/:id/edit', tokenHandler, roleAccess('mentor'), editStudyGroup);
    router.delete('/:id/remove', tokenHandler, roleAccess('mentor'), removeStudyGroup);

    router.get('/:id/presence', tokenHandler, roleAccess(['mentor', 'student']), getPresence);
    router.put('/:id/presence/edit', tokenHandler, roleAccess('mentor'), updatePresenceSchema, updatePresence);

    router.put('/:id/video/add', tokenHandler, roleAccess('mentor'), linkRequired(), addVideoStudyGroup);
    router.put('/:id/video/edit/', tokenHandler, roleAccess('mentor'), linkRequired(), editVideoStudyGroup);

    app.use('/api/v1/studygroup', router);
}