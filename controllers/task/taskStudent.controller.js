const {updateTask} = require("../../models/task/task.model");
const {quizAnswerTable} = require("../../models/task/quiz/quizAnswer.model");
const {divTable} = require("../../models/div.model");
const {taskTable} = require('../../models/task/task.model');
const {quizSkor, quizQuestionTable} = require("../../models/task/quiz/quiz.model");
const {taskStudentTable, updateTaskStudent} = require("../../models/task/taskStudent.model");
const {responseError, responseData} = require("../../utils/responseHandler");

exports.list = async (req, res) => {
    try {
        const query = req.query;
        const authData = req.authData;
        const page = query.page || 1;
        const paramsTaskStudent = {};
        let totalData = null;
        const params = {
            div_id: authData.div_id,
            is_remove: "false"
        };

        if (req.params.id) {
            params.task_id = req.params.id;
        }

        if (authData.role_id === 1) {
            params.mentor_id = authData.user_id;

            if (req.params.id2) {
                paramsTaskStudent.student_id = req.params.id2;
            }
        } else if (authData.role_id === 2) {
            paramsTaskStudent.student_id = authData.user_id;
        }

        const task = await taskTable(params);
        if (!req.params.id) {
            totalData = task.length;
        }
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
            paramsTaskStudent.task_id = e.id;
            const ts = await taskStudentTable(paramsTaskStudent);
            if (req.params.id) {
                totalData = ts.length;
            }
            data.detail = await Promise.all(ts.map(async e => {
                const now = new Date().getTime();
                const deadline = new Date(e.deadline).getTime();
                if (e.status_id === 1 && now > deadline) {
                    await updateTaskStudent({
                        status_id: 4,
                        is_active: 0,
                    }, e.id)
                }
                if (e.status_id === 4 && now < deadline) {
                    await updateTaskStudent({
                        status_id: 1,
                        is_active: 1,
                    }, e.id)
                }
                const data = {
                    student: {
                        id: e.student_id,
                        name: e.student_name,
                    },
                    score: e.score,
                    is_active: Boolean(e.is_active),
                    status: {
                        id: e.status_id,
                        value: e.value,
                    },
                }
                if (e.type === 'quiz') {
                    const skor = await quizSkor({task_student_id: e.id});
                    data.score = skor[0].score;
                    const question = await quizQuestionTable({task_id: e.task_id})
                    const answer = await quizAnswerTable({task_student_id: e.id})
                    if (e.status_id === 1 && question.length === answer.length) {
                        await updateTaskStudent({
                            status_id: 3,
                            is_active: 0,
                        }, e.id)
                    }
                    data.score = e.score;
                    data.is_active = Boolean(e.is_active)
                }
                const div = await divTable({div_id: e.div_id});
                data.student.div = div[0].name;
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