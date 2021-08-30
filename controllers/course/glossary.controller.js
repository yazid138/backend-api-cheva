const cek = require("../../utils/cekTable");
const validate = require("../../middleware/validation");
const {responseMessage} = require("../../utils/responseHandler");
const {
    courseGlossaryTable,
    insertCourseGlossary,
    updateCourseGlossary,
    deleteCourseGlossary
} = require("../../models/course/courseGlossary.model");
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

exports.edit = async (req, res) => {
    try {
        const body = req.body;

        const course = await cek.course(req, res);

        const glossary = await courseGlossaryTable({
            glossary_id: req.params.id2,
            course_id: course[0].id
        })

        if (glossary.length === 0) {
            responseError(res, 400, [], 'glossary id tidak ada');
            return;
        }

        const data = {}

        if (body.title) {
            data.title = body.title;
        }

        if (body.description) {
            data.description = body.description;
        }

        if (Object.keys(data).length > 0) {
            const update = await updateCourseGlossary(data, glossary[0].id);
            responseData(res, 200, update);
        } else {
            responseMessage(res, 200, 'tidak ada data yg berubah');
        }
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.remove = async (req, res) => {
    try {
        const course = await cek.course(req, res);

        const glossary = await courseGlossaryTable({
            glossary_id: req.params.id2,
            course_id: course[0].id
        })

        if (glossary.length === 0) {
            responseError(res, 400, [], 'glossary id tidak ada');
            return;
        }

        const del = await deleteCourseGlossary(glossary[0].id);

        responseData(res, 200, del);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}