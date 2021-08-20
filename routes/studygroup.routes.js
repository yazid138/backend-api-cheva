const {getPresence} = require("../controllers/studygroup/precence.controller");
const {editVideoStudyGroup} = require("../controllers/studygroup/studygroup.controller");
const {addVideoStudyGroup} = require("../controllers/studygroup/studygroup.controller");
const {studygroupUpdateShcema} = require("../middleware/validation");
const {linkRequired} = require("../middleware/link.middleware");
const {updatePresenceSchema} = require("../middleware/validation");
const {updatePresence} = require("../controllers/studygroup/studygroup.controller");
const {
    infoSchema,
    sgSchema,
    presenceSchema
} = require("../middleware/validation");
const {
    createStudyGroup,
    getStudyGroup,
    addPresence,
    editStudyGroup,
    removeStudyGroup
} = require("../controllers/studygroup/studygroup.controller");
const {imageRequired} = require("../middleware/media.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");

const router = require('express').Router();

module.exports = app => {
    router.get('/', tokenHandler, roleAccess(['mentor', 'student']), getStudyGroup);
    router.get('/presence', tokenHandler, roleAccess(['mentor', 'student']), getPresence);

    router.post('/create', tokenHandler, roleAccess('mentor'), infoSchema, sgSchema, imageRequired(), createStudyGroup);

    router.get('/:id', getStudyGroup);
    router.put('/:id/edit', tokenHandler, roleAccess('mentor'), editStudyGroup);
    router.delete('/:id/remove', tokenHandler, roleAccess('mentor'), removeStudyGroup);
    // router.post('/presence/add', tokenHandler, roleAccess('mentor'), presenceSchema, addPresence);

    router.get('/:id/presence', tokenHandler, roleAccess(['mentor', 'student']), getPresence);
    router.put('/:id/presence/edit', tokenHandler, roleAccess('mentor'), updatePresenceSchema, updatePresence);

    router.put('/:id/video/add', tokenHandler, roleAccess('mentor'), linkRequired(), addVideoStudyGroup);
    router.put('/:id/video/edit/', tokenHandler, roleAccess('mentor'), linkRequired(), editVideoStudyGroup);

    app.use('/api/v1/studygroup', router);
}