const {sgTable} = require('../models/studygroup.model');
const {
    responseError,
    responseData
} = require("../utils/responseHandler");

exports.sg = async (req, res) => {
    const params = {};
    const sg = await sgTable(params);
    responseData(res, 200, sg);
}