const cek = require("../../utils/cekTable");
const validate = require("../../middleware/validation");
const {insertCourseGlossary} = require("../../models/course/courseGlossary.model");
const {responseData, responseError} = require("../../utils/responseHandler");
const {validationResult} = require("express-validator");

exports.create = [
    validate.infoSchema,
    async (req, res) => {
        const body = req.body;

        const course = await cek.course(req, res);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseError(res, 400, errors.array());
            return;
        }

        const data = {
            title: body.title,
            description: body.description,
            course_id: course[0].id,
        }

        const glossary = await insertCourseGlossary(data);
        responseData(res, 200, glossary);
    }
]