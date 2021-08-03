const {insertQuizOption} = require("../../models/task/quiz/quizOption.model");
const {insertQuizQuestion} = require("../../models/task/quiz/quiz.model");
const {quizOptionTable} = require("../../models/task/quiz/quizOption.model");
const {mediaTable} = require("../../models/media.model");
const {taskTable} = require("../../models/task/task.model");
const {quizQuestionTable} = require("../../models/task/quiz/quiz.model");
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.getQuiz = async (req, res) => {
    try {
        const query = req.query;
        const params = {
            type: 'quiz',
        };

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
            const question = await quizQuestionTable({task_id: e.id});
            data.quiz = await Promise.all(question.map(async e => {
                const data = {
                    id: e.id,
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

            return data;
        }))

        responseData(res, 200, data);
    } catch
        (err) {
        responseError(res, 400, err);
    }
}

exports.createQuiz = async (req, res) => {
    try {
        const body = req.body;
        const media = req.media;

        const data = {
            question: body.question,
            task_id: body.task_id,
            media_id: media ? media.id : null,
        }

        const quiz = await insertQuizQuestion(data);
        responseData(res, 200, quiz);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.createOption = async (req, res) => {
    try {
        const body = req.body;
        const media = req.media;

        const data = {
            quiz_question_id: body.question_id,
            value: body.value,
            is_true: body.is_true === "true",
            media_id: media ? media.id : null,
        }

        const option = await insertQuizOption(data);
        responseData(res, 200, option);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}