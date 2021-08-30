const validate = require("../../../middleware/validation");
const cek = require("../../../utils/cekTable");
const {deleteMedia} = require("../../../utils/helper");
const {uploadValidation} = require("../../../utils/fileUpload");
const {check, validationResult} = require("express-validator");
const {addMedia} = require("../../../utils/helper");
const {
    quizOptionTable,
    insertQuizOption,
    updateOption,
    deleteOption
} = require("../../../models/task/quiz/quizOption.model");
const {quizQuestionTable} = require("../../../models/task/quiz/quiz.model");
const {taskTable} = require("../../../models/task/task.model");
const {responseError, responseData} = require("../../../utils/responseHandler");

exports.create = [
    validate.quizOptionScheme,
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
            const body = req.body;
            const authData = req.authData;
            const file = req.files;

            const task = await taskTable({
                is_remove: false,
                is_active: true,
                mentor_id: authData.user_id,
                type: 'quiz',
                task_id: req.params.id
            })

            if (task.length === 0) {
                responseError(res, 400, [], 'task id tidak ada')
                return;
            }

            const qq = await quizQuestionTable({
                quiz_question_id: req.params.id2,
                task_id: task[0].id
            })

            if (qq.length === 0) {
                responseError(res, 400, [], 'question id tidak ada')
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            let media = {}
            if (file && file.media && body.media_label) {
                media = await addMedia(res, {
                    file: file.media,
                    label: body.media_label
                })
            }

            const data = {
                quiz_question_id: qq[0].id,
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
]

exports.edit = async (req, res) => {
    try {
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

        const qo = await quizOptionTable({
            quiz_question_id: question[0].id,
            quiz_option_id: req.params.id3
        })

        if (qo.length === 0) {
            responseError(res, 400, [], 'option id tidak ada');
            return;
        }

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

        const qo = await quizOptionTable({
            quiz_question_id: question[0].id,
            quiz_option_id: req.params.id3
        })

        if (qo.length === 0) {
            responseError(res, 400, [], 'option id tidak ada');
            return;
        }

        const remove = await deleteOption(qo[0].id);

        if (qo[0].media_id) await deleteMedia(qo[0].media_id);

        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err.message);
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

            const qo = await quizOptionTable({
                quiz_question_id: question[0].id,
                quiz_option_id: req.params.id3
            })

            if (qo.length === 0) {
                responseError(res, 400, [], 'option id tidak ada');
                return;
            }

            if (qo[0].media_id) {
                responseError(res, 400, [], 'media sudah ada');
                return;
            }

            if (!file || !file.media) {
                responseError(res, 400, [], 'file media harus di upload');
                return;
            }

            const fileValidation = uploadValidation(file.media);
            if (!fileValidation.success) {
                responseError(res, 400, [], fileValidation.result);
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

            const add = await updateOption({
                media_id: media.id
            }, qo[0].id);

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

        const qo = await quizOptionTable({
            quiz_question_id: question[0].id,
            quiz_option_id: req.params.id3
        })

        if (qo.length === 0) {
            responseError(res, 400, [], 'option id tidak ada');
            return;
        }

        if (!qo[0].media_id) {
            responseError(res, 400, [], 'media tidak ada');
            return;
        }

        const remove = await updateOption({
            media_id: null
        }, qo[0].id);

        await deleteMedia(qo[0].media_id);

        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}