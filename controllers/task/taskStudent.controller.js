const {divTable} = require("../../models/div.model");
const {taskStudentTable} = require("../../models/task/taskStudent.model");
const {taskTable} = require('../../models/task/task.model');
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.getTaskStudent = async (req, res) => {
    try {
        const query = req.query;
        const params = {};
        if (query.task_student_id) {
            params.task_student_id = query.task_student_id;
        }
        if (query.task_id) {
            params.task_id = query.task_id;
        }
        if (query.status_id) {
            params.status_id = query.status_id;
        }
        if (query.is_active) {
            params.is_active = query.is_active;
        }

        const ts = await taskStudentTable(params);

        if (ts.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
        }

        const data = await Promise.all(ts.map(async e => {
            const data = {
                task_student_id: e.id,
                task_id: e.task_id,
                score: e.score,
                is_active: e.is_active,
                student: {
                    id: e.student_id,
                    name: e.student_name,
                },
                status: {
                    id: e.status_id,
                    value: e.value,
                },
            }
            const div = await divTable({div_id: e.div_id});
            data.student.div = {
                id: div[0].id,
                name: div[0].name,
            }
            return data;
        }))

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}