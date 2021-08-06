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
    addPresence
} = require("../controllers/studygroup/studygroup.controller");
const {imageRequired} = require("../middleware/media.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");

const router = require('express').Router();

module.exports = app => {
    router.get('/', getStudyGroup);

    router.post('/create', tokenHandler, roleAccess('mentor'), infoSchema, sgSchema, imageRequired(), createStudyGroup);
    router.post('/presence/add', tokenHandler, roleAccess('mentor'), presenceSchema, addPresence);

    router.put('/presence/edit', tokenHandler, roleAccess('mentor'), updatePresenceSchema, updatePresence);
    router.put('/video/add', tokenHandler, roleAccess('mentor'), studygroupUpdateShcema, linkRequired(), addVideoStudyGroup);

    app.use('/api/v1/studygroup', router);
}