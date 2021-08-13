const {updateQuestion} = require("../../models/task/quiz/quiz.model");
const {updateOption} = require("../../models/task/quiz/quizOption.model");
const {updateQuestionAnswer} = require("../../models/task/quiz/quizAnswer.model");
const {validationResult} = require("express-validator");
const {taskStudentTable} = require("../../models/task/taskStudent.model");
const {mediaTable} = require("../../models/media.model");
const {taskTable} = require("../../models/task/task.model");
const {
    quizAnswerTable,
    insertQuizAnswer
} = require("../../models/task/quiz/quizAnswer.model");
const {
    quizOptionTable,
    insertQuizOption
} = require("../../models/task/quiz/quizOption.model");
const {
    quizQuestionTable,
    insertQuizQuestion
} = require("../../models/task/quiz/quiz.model");
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
        const paramsQuestion = {}

        if (query.task_id) {
            params.task_id = query.task_id;
        }

        if (query.question_id) {
            paramsQuestion.quiz_question_id = query.question_id;
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
            paramsQuestion.task_id = e.id;
            const question = await quizQuestionTable(paramsQuestion);
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
    } catch (err) {
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
exports.editQuestion = async (req, res) => {
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

exports.createOption = async (req, res) => {
    try {
        const body = req.body;
        const media = req.media;

        const data = {
            quiz_question_id: body.question_id,
            value: body.value,
            media_id: media ? media.id : null,
        }
        data.is_true = (typeof body.is_true === 'boolean') ?
            body.is_true === true : body.is_true === 'true';

        const option = await insertQuizOption(data);
        responseData(res, 200, option);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.editOption = async (req, res) => {
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
        const qo = await quizOptionTable({
            quiz_question_id: question[0].id,
            quiz_option_id: body.option_id
        })
        const data = {}
        if (body.value) {
            data.value = body.value;
        }

        if (body.is_true) {
            data.is_true = (typeof body.is_true === 'boolean') ?
                body.is_true === true : body.is_true === 'true';
        }
        const update = await updateOption(data, qo[0].id)
        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.getQuizAnswer = async (req, res) => {
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
            return;
        }

        const data = await Promise.all(task.map(async e => {
            const data = {
                task_id: e.id,
            }
            const ts = await taskStudentTable({task_id: e.id});
            data.student = await Promise.all(ts.map(async e => {
                const data = {
                    name: e.student_name,
                    div: e.div_name,
                }
                const answer = await quizAnswerTable({task_student_id: e.id});
                data.answer = answer.map(e => {
                    return {
                        question_id: e.quiz_question_id,
                        option_id: e.quiz_option_id,
                        is_true: Boolean(e.is_true),
                        value: e.answer
                    }
                });
                return data;
            }))
            return data;
        }))

        responseData(res, 200, data);
    } catch
        (err) {
        responseError(res, 400, err.message);
    }
}

exports.addAnswer = async (req, res) => {
    try {
        const body = req.body;
        const authData = req.authData;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseError(res, 400, errors.array());
            return;
        }

        const ts = await taskStudentTable({
            student_id: authData.user_id,
            task_id: body.task_id
        })

        if (ts.length === 0) {
            responseError(res, 400, [], 'data tidak ada');
            return;
        }

        const data = {
            task_student_id: ts[0].id,
            quiz_option_id: body.option_id,
            quiz_question_id: body.question_id,
        }

        const result = await insertQuizAnswer(data);


        responseData(res, 200, result);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.updateQuestionAnswer = async (req, res) => {
    try {
        const body = req.body;
        const authData = req.authData;

        const task = await taskTable({
            task_id: body.task_id,
            type: 'quiz'
        })
        const ts = await taskStudentTable({
            student_id: authData.user_id,
            task_id: task[0].id,
            status_id: 1,
        })

        const question = await quizQuestionTable({
            task_id: task[0].id,
            quiz_question_id: body.question_id
        })

        const qa = await quizAnswerTable({
            task_student_id: ts[0].id,
            question_id: question[0].id
        })

        // responseData(res, 200, qa);
        const update = await updateQuestionAnswer({
            quiz_option_id: body.option_id
        }, qa[0].id);

        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err);
    }
}
