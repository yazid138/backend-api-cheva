const {courseTable} = require('../models/course.model');
const {
    responseError,
    responseData
} = require("../utils/responseHandler");

exports.course = async (req, res) => {
    const params = {};
    const course = await courseTable(params);
    responseData(res, 200, course);
}