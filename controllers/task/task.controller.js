const validate = require('../../middleware/validation');
const {check, validationResult} = require("express-validator");
const {addMedia} = require("../../utils/helper");
const {userTable} = require("../../models/user.model");
const {linkTable} = require("../../models/link.model");
const {insertTaskStudent} = require("../../models/task/taskStudent.model");
const {taskHelperTable,} = require("../../models/task/taskHelper.model");
const {
    taskTable,
    insertTask,
    updateTask,
    deleteTask
} = require('../../models/task/task.model');
const {responseError, responseData} = require("../../utils/responseHandler");
const cek = require('../../utils/cekTable');
const {deleteMedia} = require("../../utils/helper");
const {uploadValidation} = require("../../utils/fileUpload");
const {editMedia} = require("../../utils/helper");
const {mediaTable} = require("../../models/media.model");

exports.list = async (req, res) => {
    try {
        const query = req.query;
        const authData = req.authData;
        const page = query.page || 1;
        const params = {
            div_id: authData.div_id,
            limit: 500
        };

        if (authData.role_id === 1) {
            params.mentor_id = authData.user_id;
        }

        if (req.params.id) {
            params.task_id = req.params.id;
        }

        if (query.is_active) {
            params.is_active = typeof query.is_active === 'string' && query.is_active === 'true' ?
                query.is_active === 'true' : query.is_active;
        }
        if (query.type) {
            params.type = query.type;
        }

        if (query.order_by) {
            params.order_by = query.order_by;
            params.ascdesc = query.ascdesc || 'ASC';
        }

        await updateTask({
            is_active: false,
            updated_at: new Date()
        },{
            deadline: true
        })
        await updateTask({
            is_active: true,
            updated_at: new Date()
        },{
            deadline: false
        })

        let task = await taskTable(params);
        const totalData = task.length;
        if (task.length === 0 && req.params.id) {
            responseError(res, 400, [], 'task id tidak ada');
            return;
        }

        if (query.limit) {
            const startIndex = (parseInt(page) - 1) * parseInt(query.limit);
            const endIndex = parseInt(page) * query.limit;
            task = task.slice(startIndex, endIndex);
        }

        const data = await Promise.all(task.map(async e => {
            const data = {
                task_id: e.id,
                title: e.title,
                description: e.description,
                type: e.type,
                deadline: e.deadline,
                is_active: Boolean(e.is_active),
                mentor: {
                    name: e.mentor_name,
                    div: e.div_name,
                },
                created_at: e.created_at,
                updated_at: e.updated_at,
                media: {
                    id: e.media_id,
                    label: e.label,
                    uri: e.uri,
                }
            }
            let th = await taskHelperTable({task_id: e.id})
            if (th.length !== 0) {
                th = await Promise.all(th.map(async e => {
                    const data = {
                        id: e.id,
                        title: e.title
                    }
                    const link = await linkTable({link_id: e.link_id});
                    data.link = {
                        id: link[0].id,
                        uri: link[0].uri,
                    }
                    return data;
                }))
            }
            data.helper = th;
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

exports.create = [
    validate.infoSchema,
    validate.mediaSchema,
    validate.taskSchema,
    async (req, res) => {
        try {
            const authData = req.authData;
            const body = req.body;
            const file = req.files;

            if (!file || !file.media) {
                responseError(res, 400, [], 'file media harus di upload');
                return;
            }

            const fileValidation = uploadValidation(file.media);
            if (!fileValidation.success) {
                responseError(res, 400, [],fileValidation.result);
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const media = await addMedia(res, {
                file: file.media,
                label: body.media_label
            });

            const data = {
                title: body.title,
                description: body.description,
                deadline: new Date(body.deadline),
                type: body.type,
                media_id: media.id,
                mentor_id: authData.user_id,
                div_id: authData.div_id,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const students = await userTable({role_id: 2, div_id: authData.div_id});
            if (students.length === 0) {
                responseError(res, 400, [], 'tidak ada student');
                return
            }
            let task = await insertTask(data);
            responseData(res, 200, task);
            let taskStudent = [];
            let i = 0;
            for (const e of students) {
                const data = {
                    task_id: task.id,
                    student_id: e.id,
                    updated_at: new Date()
                }
                taskStudent[i] = await insertTaskStudent(data);
                i++;
            }

            const result = {
                task_id: task.id,
                message: 'success',
            }
            result.student = taskStudent.map(e => {
                return {
                    id: e.id,
                }
            })

            responseData(res, 201, result,);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]

exports.edit = [
    check('title')
        .optional()
        .isString(),
    check('description')
        .optional()
        .isString(),
    check('deadline')
        .optional()
        .not()
        .custom(value => {
            const date = (new Date(value)).getTime();
            if (date > 0)
                throw new Error('date valid');
            return true;
        }).withMessage('format timestamp tidak benar'),
    async (req, res) => {
        try {
            const body = req.body;

            const task = await cek.task(req, res);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const data = {
                updated_at: new Date()
            };

            if (body.title) {
                data.title = body.title;
            }
            if (body.description) {
                data.description = body.description;
            }
            if (body.deadline) {
                data.deadline = body.deadline;
            }

            const edit = await updateTask(data, task[0].id)

            const now = Date.now();
            const deadline = new Date(task[0].deadline).getTime();
            if (now < deadline) {
                await updateTask({
                    is_active: true,
                }, task[0].id);
            } else {
                await updateTask({
                    is_active: false,
                }, task[0].id);
            }

            responseData(res, 200, edit);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.remove = async (req, res) => {
    try {
        const task = await cek.task(req, res);

        const remove = await deleteTask(task[0].id);

        await deleteMedia(task[0].media_id);

        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.editMedia = async (req, res) => {
    try {
        const body = req.body;
        const file = req.files;

        const task = await cek.task(req, res);

        if (!file || !file.media) {
            responseError(res, 400, [], 'tidak ada file media');
            return;
        }

        const fileValidation = uploadValidation(file.media);
        if (!fileValidation.success) {
            responseError(res, 400, [], fileValidation.result);
            return;
        }

        const media = await mediaTable({
            media_id: task[0].media_id
        })

        const data = {
            file: file.media,
            path: media[0].uri,
        };

        if (body.media_label) {
            data.label = body.media_label;
        }

        const update = await editMedia(res, task[0].media_id, data)

        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}