const {insertTaskStudent} = require("../../models/task/taskStudent.model");
const {userTable} = require("../../models/user.model");
const {insertTask} = require("../../models/task/task.model");
const {linkTable} = require("../../models/link.model");
const {taskHelperTable} = require("../../models/task/taskHelper.model");
const {taskTable} = require('../../models/task/task.model');
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.getTask = async (req, res) => {
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
                title: e.title,
                description: e.description,
                type: e.type,
                deadline: e.deadline,
                is_active: e.is_active,
                mentor: {
                    id: e.mentor_id,
                    name: e.mentor_name,
                    div: {
                        id: e.div_id,
                        name: e.div_name,
                    },
                },
                created_at: e.created_at,
                updateAt: e.updated_at,
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
        responseError(res, 400, err);
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

        let task = await insertTask(data);
        let taskStudent = [];
        let i = 0;
        for (const e of students) {
            const data = {
                task_id: task.id,
                student_id: e.id,
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