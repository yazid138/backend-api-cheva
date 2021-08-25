const {insertCourseGlossary} = require("../../models/course/courseGlossary.model");
const {responseData,responseError} = require("../../utils/responseHandler");
const {validationResult} = require("express-validator");

exports.create = async (req, res) => {
    const body = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        responseError(res, 400, errors.array());
        return;
    }

    const data = {
        title: body.title,
        description: body.description,
        course_id: body.course_id,
    }

    const glossary = await insertCourseGlossary(data);
    responseData(res, 200, glossary);
}