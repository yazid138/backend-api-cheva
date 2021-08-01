const {taskTable} = require('../models/task.model');
const {
    responseError,
    responseData
} = require("../utils/responseHandler");

exports.task = async (req, res) => {
    const params = {};
    const task = await taskTable(params);
    responseData(res, 200, task);
}