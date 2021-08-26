const validate = require("../../../middleware/validation");
const cek = require("../../../utils/cekTable");
const {deleteMedia} = require("../../../utils/helper");
const {validationResult} = require("express-validator");
const {check} = require("express-validator");
const {addMedia} = require("../../../utils/helper");
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
        const authData = req.authData;
        const query = req.query;
        const page = query.page || 1
        const params = {
            type: 'quiz',
            task_id: req.params.id
        };

        if (authData.role_id === 1) {
            params.mentor_id = authData.user_id;
        }

        const task = await taskTable(params);
        if (task.length === 0) {
            responseError(res, 400, [], 'task id tidak ada');
            return;
        }

        const paramsQuestion = {
            task_id: task[0].id
        }

        if (req.params.id2) {
            paramsQuestion.quiz_question_id = req.params.id2;
        }


        let question = await quizQuestionTable(paramsQuestion);
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
        responseError(res, 400, err.message);
    }
}

exports.create = [
    validate.quizQuestionSchema,
    check('media_label')
        .if((value, {req}) => {
            const file = req.files;
            if (file == null || !file.media && value !== null) {
                throw new Error('media_label harus diisi');
            }
            return true;
        })
        .notEmpty().withMessage('media_label harus diisi')
        .bail()
        .matches(/[\w]/).withMessage('media_label harus huruf dan angka')
        .trim().escape(),
    async (req, res) => {
        try {
            const authData = req.authData;
            const body = req.body;
            const file = req.files;
            let media = {}

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

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            if (file && file.media && body.media_label) {
                media = await addMedia(res, {
                    file: file.media,
                    label: body.media_label,
                });
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
]

exports.edit = [
    check('question')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isString(),
    async (req, res) => {
        try {
            const authData = req.authData;
            const body = req.body;
            const task = await taskTable({
                task_id: req.params.id,
                type: 'quiz',
                mentor_id: authData.user_id
            })

            if (task.length === 0) {
                responseError(res, 400, [], 'task id tidak ada');
                return;
            }

            const question = await quizQuestionTable({
                task_id: task[0].id,
                quiz_question_id: req.params.id2
            })

            if (question.length === 0) {
                responseError(res, 400, [], 'question id tidak ada');
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const update = await updateQuestion({
                question: body.question
            }, question[0].id);
            responseData(res, 200, update);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.delete = async (req, res) => {
    try {
        const task = await cek.task(req, res);

        const question = await quizQuestionTable({
            task_id: task[0].id,
            type: 'quiz',
            quiz_question_id: req.params.id2,
        })
        if (question.length === 0) {
            responseError(res, 400, [], 'question id tidak ada');
            return;
        }

        const remove = await deleteQuestion(question[0].id);
        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.addMedia = [
    check('media_label')
        .if((value, {req}) => {
            const file = req.files;
            if (file == null || !file.media && value !== null) {
                throw new Error('media_label harus diisi');
            }
            return true;
        })
        .notEmpty().withMessage('media_label harus diisi')
        .bail()
        .matches(/[\w]/).withMessage('media_label harus huruf dan angka')
        .trim().escape(),
    async (req, res) => {
        try {
            const file = req.files;
            const body = req.body;
            const task = await cek.task(req, res);

            const question = await quizQuestionTable({
                task_id: task[0].id,
                type: 'quiz',
                quiz_question_id: req.params.id2,
            })
            if (question.length === 0) {
                responseError(res, 400, [], 'question id tidak ada');
                return;
            }

            if (question[0].media_id) {
                responseError(res, 400, [], 'media sudah ada');
                return;
            }

            if (!file || !file.media) {
                responseError(res, 400, [], 'file media harus di upload');
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
            })

            const add = await updateQuestion({
                media_id: media.id
            }, question[0].id);

            responseData(res, 200, add);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]

exports.removeMedia = async (req, res) => {
    try {
        const task = await cek.task(req, res);

        const question = await quizQuestionTable({
            task_id: task[0].id,
            type: 'quiz',
            quiz_question_id: req.params.id2,
        })
        if (question.length === 0) {
            responseError(res, 400, [], 'question id tidak ada');
            return;
        }

        if (!question[0].media_id) {
            responseError(res, 400, [], 'media tidak ada');
            return;
        }

        const remove = await updateQuestion({
            media_id: null
        }, question[0].id);

        await deleteMedia(question[0].media_id);


        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}