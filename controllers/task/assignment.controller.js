const {updateLink} = require("../../models/link.model");
const {taskTable} = require('../../models/task/task.model');
const {insertStudentAssignment, studentAssignmentTable} = require("../../models/task/studentAssignment.model");
const {taskStudentTable, updateTaskStudent} = require("../../models/task/taskStudent.model");
const {responseError, responseData} = require("../../utils/responseHandler");
const {check, validationResult} = require('express-validator');

exports.list = async (req, res) => {
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

exports.add = async (req, res) => {
    try {
        const link = req.link;
        const authData = req.authData;

        const task = await taskTable({
            task_id: req.params.id,
            type: 'assignment'
        })

        const ts = await taskStudentTable({
            task_id: task[0].id,
            student_id: authData.user_id
        });

        if (ts.length === 0) {
            responseError(res, 400, 'tidak ada data');
            return;
        }
        const assignmentTable = await studentAssignmentTable({
            task_student_id: ts[0].id
        });

        if (assignmentTable.length > 0) {
            responseError(res, 400, [], 'sudah ada, harap ubah');
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

exports.edit = [
    check('url')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isURL().withMessage('bukan url')
    , async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array())
                return;
            }
            const body = req.body;
            const authData = req.authData;
            const task = await taskTable({
                task_id: req.params.id,
                type: 'assignment',
                is_remove: false,
                is_active: true,
            })

            if (task.length === 0) {
                responseError(res, 400, [], 'tidak ada data');
                return;
            }

            const ts = await taskStudentTable({
                task_id: task[0].id,
                student_id: authData.user_id
            });

            if (ts.length === 0) {
                responseError(res, 400, 'tidak ada data');
                return;
            }

            const assignmentTable = await studentAssignmentTable({
                task_student_id: ts[0].id
            })

            const update = await updateLink({
                uri: body.url,
                updated_at: new Date(),
            }, assignmentTable[0].link_id)

            responseData(res, 200, update);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]