const cek = require("../../utils/cekTable");
const {insertCourseChapter} = require("../../models/course/courseChapter.model");
const {responseData, responseError} = require("../../utils/responseHandler");
const {check, validationResult} = require("express-validator");

exports.create = [
    check('title')
        .notEmpty().withMessage('harus diisi')
        .trim()
    ,
    async (req, res) => {
        try {
            const body = req.body;

            const course = await cek.course(req, res);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const data = {
                title: body.title,
                course_id: course[0].id,
            }

            const cc = await insertCourseChapter(data);
            responseData(res, 200, cc);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]