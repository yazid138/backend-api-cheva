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

        if (query.task_id) {
            params.task_id = query.task_id;
        }

        const task = await taskTable(params);

        if (task.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
        }

        const data = await Promise.all(task.map(async e => {
            const data = {
                task_id: e.id,
            }
            const ts = await taskStudentTable({task_id: e.id});
            data.detail = await Promise.all(ts.map(async e => {
                const data = {
                    task_student_id: e.id,
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
            return data;
        }))

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}