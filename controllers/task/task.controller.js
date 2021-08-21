const {userTable} = require("../../models/user.model");
const {linkTable} = require("../../models/link.model");
const {insertTaskStudent} = require("../../models/task/taskStudent.model");
const {
    taskHelperTable,
    insertTaskHelper
} = require("../../models/task/taskHelper.model");
const {
    taskTable,
    insertTask,
    updateTask
} = require('../../models/task/task.model');
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.getTask = async (req, res) => {
    try {
        const query = req.query;
        const authData = req.authData;
        const params = {
            div_id: authData.div_id,
            is_remove: 'false'
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
        const task = await taskTable(params);
        // responseData(res, 200, {task, params});
        // return;
        if (task.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        const data = await Promise.all(task.map(async e => {
            const now = Date.now();
            const deadline = new Date(e.deadline).getTime();
            if (now > deadline) {
                await updateTask({
                    is_active: false,
                }, e.id);
            }
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

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.createTask = async (req, res) => {
    try {
        const authData = req.authData;
        const body = req.body;
        const id_image = req.media.id;

        const data = {
            title: body.title,
            description: body.description,
            deadline: new Date(body.deadline),
            type: body.type,
            media_id: id_image,
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

        responseData(res, 201, result);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.editTask = async (req, res) => {
    try {
        const body = req.body;
        const authData = req.authData;

        const task = await taskTable({
            task_id: req.params.id,
            mentor_id: authData.user_id,
            is_remove: false
        })

        if (task.length === 0) {
            responseError(res, 400, [], 'tidak ada');
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

exports.removeTask = async (req, res) => {
    try {
        const authData = req.authData;

        const task = await taskTable({
            task_id: req.params.id,
            mentor_id: authData.user_id,
            is_remove: "false"
        })

        if (task.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        const data = {
            updated_at: new Date(),
            is_remove: true
        };

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

exports.addTaskHelper = async (req, res) => {
    try {
        const body = req.body;
        const authData = req.authData;
        const link = req.link;

        const task = await taskTable({
            task_id: req.params.id,
            mentor_id: authData.user_id,
        })

        if (task.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
        }

        const data = {
            task_id: task[0].id,
            title: body.title,
            link_id: link.id,
        }

        const taskHelper = await insertTaskHelper(data);
        responseData(res, 200, taskHelper);
    } catch (err) {
        responseError(res, 400, err);
    }
}