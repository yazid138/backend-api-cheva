const {quizAnswerTable} = require("../../models/task/quiz/quizAnswer.model");
const {divTable} = require("../../models/div.model");
const {taskTable} = require('../../models/task/task.model');
const {
    quizSkor,
    quizQuestionTable
} = require("../../models/task/quiz/quiz.model");
const {
    taskStudentTable,
    updateTaskStudent
} = require("../../models/task/taskStudent.model");
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.getTaskStudent = async (req, res) => {
    try {
        const authData = req.authData;
        const paramsTaskStudent = {};
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
        if (task.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        const data = await Promise.all(task.map(async e => {
            const data = {
                task_id: e.id,
            }
            paramsTaskStudent.task_id = e.id;
            const ts = await taskStudentTable(paramsTaskStudent);
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
                    if (e.status_id === 3 && question.length !== answer.length) {
                        await updateTaskStudent({
                            status_id: 1,
                            is_active: 1,
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

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.addScoreAssignment = async (req, res) => {
    try {
        const body = req.body;
        const task = await taskTable({
            task_id: body.task_id,
            type: 'assignment',
            is_active: true
        })
        if (task.length === 0) {
            responseError(res, 400, 'tidak ada');
            return;
        }

        const addScore = await updateTaskStudent({
            score: body.score,
            status_id: 3,
            is_active: 0,
        }, {
            task_id: body.task_id,
            student_id: body.student_id
        })

        responseData(res, 200, addScore);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}