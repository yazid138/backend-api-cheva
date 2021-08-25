const {updateTaskStudent} = require("../../../models/task/taskStudent.model");
const {mediaTable} = require("../../../models/media.model");
const {taskTable} = require("../../../models/task/task.model");
const {quizOptionTable} = require("../../../models/task/quiz/quizOption.model");
const {
    quizQuestionTable,
    insertQuizQuestion,
    deleteQuestion,
    updateQuestion
} = require("../../../models/task/quiz/quiz.model");
const {responseError, responseData} = require("../../../utils/responseHandler");

exports.list = async (req, res) => {
    try {
        const query = req.query;
        const page = query.page || 1
        const params = {
            type: 'quiz',
            task_id: req.params.id
        };
        const paramsQuestion = {}

        if (query.question_id) {
            paramsQuestion.quiz_question_id = query.question_id;
        }

        const task = await taskTable(params);
        if (task.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        let question = await quizQuestionTable({
            task_id: task[0].id
        })
        const totalData = question.length;

        if (query.limit) {
            const startIndex = (parseInt(page) - 1) * parseInt(query.limit);
            const endIndex = parseInt(page) * query.limit;
            question = question.slice(startIndex, endIndex);
        }

        const data = await Promise.all(question.map(async e => {
            const data = {
                question_id: e.id,
                question: e.question,
                media: []
            }
            if (e.media_id) {
                const media = await mediaTable({media_id: e.media_id});
                data.media = media.map(e => {
                    return {
                        id: e.id,
                        label: e.label,
                        uri: e.uri,
                    }
                })
            }
            const options = await quizOptionTable({quiz_question_id: e.id});
            data.options = await Promise.all(options.map(async e => {
                const data = {
                    id: e.id,
                    value: e.value,
                    is_true: Boolean(e.is_true),
                    media: []
                }
                if (e.media_id) {
                    const media = await mediaTable({media_id: e.media_id});
                    data.media = media.map(e => {
                        return {
                            id: e.id,
                            label: e.label,
                            uri: e.uri,
                        }
                    })
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
    } catch
        (err) {
        responseError(res, 400, err);
    }
}

exports.create = async (req, res) => {
    try {
        const authData = req.authData;
        const body = req.body;
        const media = req.media;

        const task = await taskTable({
            type: 'quiz',
            is_remove: false,
            is_active: true,
            mentor_id: authData.user_id,
            task_id: req.params.id
        })

        if (task.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        const data = {
            question: body.question,
            task_id: req.params.id,
            media_id: media ? media.id : null,
        }

        await updateTaskStudent({
            status_id: 1,
            is_active: 1,
        }, {
            task_id: task[0].id
        })

        const quiz = await insertQuizQuestion(data);
        responseData(res, 200, quiz);
    } catch (err) {
        responseError(res, 400, err);
    }
}
exports.edit = async (req, res) => {
    try {
        const body = req.body;
        const task = await taskTable({
            task_id: body.task_id,
            type: 'quiz'
        })
        const question = await quizQuestionTable({
            task_id: task[0].id,
            quiz_question_id: body.question_id
        })
        const update = await updateQuestion({
            question: body.question
        }, question[0].id);
        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.delete = async (req, res) => {
    try {
        const body = req.body;
        const question = await quizQuestionTable({
            task_id: body.task_id,
            type: 'quiz',
            quiz_question_id: body.question_id,
        })
        if (question.length === 0) {
            responseError(res, 400, [], 'tidak ada');
        }

        const remove = await deleteQuestion(question[0].id);
        responseError(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err);
    }
}