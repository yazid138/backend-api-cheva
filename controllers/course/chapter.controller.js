const {insertCourseChapter} = require("../../models/course/courseChapter.model");
const {responseData, responseError} = require("../../utils/responseHandler");
const {validationResult} = require("express-validator");

exports.create = async (req, res) => {
    try {
        const body = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseError(res, 400, errors.array());
            return;
        }

        const data = {
            title: body.title,
            course_id: body.course_id,
        }
        const cc = await insertCourseChapter(data);
        responseData(res, 200, cc);
    } catch (err) {
        responseError(res, 400, err);
    }
}