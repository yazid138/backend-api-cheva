const {linkTable} = require("../../models/link.model");
const {studentAssignmentTable} = require("../../models/task/studentAssignment.model");
const {updateTaskStudent} = require("../../models/task/taskStudent.model");
const {insertStudentAssignment} = require("../../models/task/studentAssignment.model");
const {taskStudentTable} = require("../../models/task/taskStudent.model");
const {taskTable} = require('../../models/task/task.model');
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.getAssignment = async (req, res) => {
    try {
        const query = req.query;
        const params = {
            type: 'assignment'
        };

        if (query.task_id) {
            params.task_id = query.task_id;
        }

        const task = await taskTable(params);
        if (task.length === 0) {
            responseError(res, 400, 'tidak ada');
            return;
        }
        const data = await Promise.all(task.map(async e => {
            const data = {
                task_id: e.id
            }
            const ts = await taskStudentTable({task_id: e.id});
            data.detail = await Promise.all(ts.map(async e => {
                const data = {
                    student_id: e.student_id,
                    name: e.student_name,
                    div: e.div_name,
                    link: null
                };
                const link = await studentAssignmentTable({task_student_id: e.id});
                if (link.length > 0) {
                    data.link = {
                        id: link[0].id,
                        uri: link[0].uri
                    }
                }
                return data;
            }))
            return data;
        }))

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.addStudentAssignment = async (req, res) => {
    try {
        const body = req.body;
        const link = req.link;
        const authData = req.authData;

        const task = await taskTable({
            task_id: body.task_id,
            type: 'assignment'
        })
        const ts = await taskStudentTable({
            task_id: task[0].id,
            student_id: authData.user_id
        });

        if (ts.length === 0) {
            responseError(res, 400, 'tidak ada');
            return;
        }

        const data = {
            task_student_id: ts[0].id,
            link_id: link.id
        }
        const a = await insertStudentAssignment(data);
        await updateTaskStudent({
            status_id: 2
        }, ts[0].id);
        responseData(res, 200, a);
    } catch (err) {
        responseError(res, 400, err);
    }
}