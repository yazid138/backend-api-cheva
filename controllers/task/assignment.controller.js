const cek = require("../../utils/cekTable");
const {addLink} = require("../../utils/helper");
const {updateLink} = require("../../models/link.model");
const {taskTable} = require('../../models/task/task.model');
const {insertStudentAssignment, studentAssignmentTable} = require("../../models/task/studentAssignment.model");
const {taskStudentTable, updateTaskStudent} = require("../../models/task/taskStudent.model");
const {responseError, responseData} = require("../../utils/responseHandler");
const {check, validationResult} = require('express-validator');

exports.list = async (req, res) => {
    try {
        const query = req.query;
        const authData = req.authData;
        const page = query.page || 1;
        const params = {
            div_id: authData.div_id,
            limit: 500,
            type: 'assignment'
        };

        if (authData.role_id === 1) {
            params.mentor_id = authData.user_id;
        }

        if (req.params.id) {
            params.task_id = req.params.id;
        }


        const task = await taskTable(params);
        const totalData = task.length;
        if (task.length === 0 && req.params.id) {
            responseError(res, 400, 'task id tidak ada');
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

        if (query.limit) {
            responseData(res, 200, data, totalData, {
                current_page: parseInt(page),
                limit: parseInt(query.limit),
                max_page: Math.ceil(totalData / parseInt(query.limit))
            });
            return
        }
        responseData(res, 200, data, totalData, {
            current_page: parseInt(page)
        });
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.add = [
    check('url')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isURL().withMessage('format url tidak sesuai'),
    async (req, res) => {
        try {
            const body = req.body;
            const authData = req.authData;

            const task = await taskTable({
                task_id: req.params.id,
                type: 'assignment'
            })

            if (task.length === 0) {
                responseError(res, 400, [], 'task id tidak ada');
                return;
            }

            const ts = await taskStudentTable({
                task_id: task[0].id,
                student_id: authData.user_id
            });

            const assignmentTable = await studentAssignmentTable({
                task_student_id: ts[0].id
            });

            if (assignmentTable.length > 0) {
                responseError(res, 400, [], 'sudah ada, harap ubah');
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const link = await addLink(body.url);

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
            responseError(res, 400, err.message);
        }
    }
]

exports.edit = [
    check('url')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isURL().withMessage('bukan url')
    , async (req, res) => {
        try {
            const body = req.body;
            const authData = req.authData;
            const task = await taskTable({
                task_id: req.params.id,
                type: 'assignment',
                is_remove: false,
                is_active: true,
            })

            if (task.length === 0) {
                responseError(res, 400, [], 'task id tidak ada');
                return;
            }

            const ts = await taskStudentTable({
                task_id: task[0].id,
                student_id: authData.user_id,
                is_active: 1
            });

            if (ts.length === 0) {
                responseError(res, 400, [], 'sudah tidak bisa diubah lagi');
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array())
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

exports.addScore = [
    check('student_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka'),
    check('score')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(value => {
            if (value >= 0 && value <= 100) {
                return true;
            }
            throw new Error('harus 0 - 100');
        }),
    async (req, res) => {
        try {
            const authData = req.authData;
            const body = req.body;

            const task = await taskTable({
                task_id: req.params.id,
                type: 'assignment',
                mentor_id: authData.user_id
            })

            if (task.length === 0) {
                responseError(res, 400, 'task tidak ada');
                return;
            }

            const ts = await taskStudentTable({
                task_id: task[0].id,
                student_id: body.student_id
            })

            if (ts.length === 0) {
                responseError(res, 400, 'student id tidak ada');
                return;
            }

            if (ts[0].score) {
                responseError(res, 400, 'score sudah ada, harap edit score');
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array())
                return;
            }

            const addScore = await updateTaskStudent({
                score: body.score,
                status_id: 3,
                is_active: 0,
            }, ts[0].id)

            responseData(res, 200, addScore);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]

exports.editScore = [
    check('student_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka'),
    check('score')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(value => {
            if (value >= 0 && value <= 100) {
                return true;
            }
            throw new Error('harus 0 - 100');
        }),
    async (req, res) => {
        try {
            const authData = req.authData;
            const body = req.body;

            const task = await taskTable({
                task_id: req.params.id,
                type: 'assignment',
                mentor_id: authData.user_id
            })

            if (task.length === 0) {
                responseError(res, 400, 'task tidak ada');
                return;
            }

            const ts = await taskStudentTable({
                task_id: task[0].id,
                student_id: body.student_id
            })

            if (ts.length === 0) {
                responseError(res, 400, 'student id tidak ada');
                return;
            }

            if (ts[0].score === null) {
                responseError(res, 400, 'tambah score terlebih dahulu');
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array())
                return;
            }

            const edit = await updateTaskStudent({
                score: body.score
            }, ts[0].id)

            responseData(res, 200, edit);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]
