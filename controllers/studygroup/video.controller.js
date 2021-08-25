const cek = require("../../utils/cekTable");
const {updateLink} = require("../../models/link.model");
const {responseData, responseError} = require("../../utils/responseHandler");
const {updateStudyGroup} = require("../../models/studygroup/studygroup.model");
const {addLink} = require("../../utils/helper");
const {check, validationResult} = require("express-validator");

exports.add = [
    check('url')
        .notEmpty().withMessage('masukkan url')
        .bail()
        .isURL().withMessage('bukan url')
    , async (req, res) => {
        try {
            const body = req.body;

            const sg = await cek.studygroup(req, res);

            if (sg[0].video_id) {
                responseError(res, 400, [], 'link sudah ada, harap update');
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
            }

            const link = await addLink(body.url);

            const data = {
                video_id: link.id,
                is_active: false,
                updated_at: new Date()
            }
            const update = await updateStudyGroup(data, sg[0].id);

            responseData(res, 200, update);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.edit = [
    check('url')
        .notEmpty().withMessage('masukkan url')
        .bail()
        .isURL().withMessage('bukan url')
    , async (req, res) => {
        try {
            const body = req.body;

            const sg = await cek.studygroup(req, res);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
            }

            const update = await updateLink({
                uri: body.url,
                updated_at: new Date(),
            }, sg[0].video_id);

            responseData(res, 200, update);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]
