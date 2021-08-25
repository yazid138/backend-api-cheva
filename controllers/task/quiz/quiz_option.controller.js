const {quizOptionTable, insertQuizOption, updateOption, deleteOption} = require("../../../models/task/quiz/quizOption.model");
const {quizQuestionTable} = require("../../../models/task/quiz/quiz.model");
const {taskTable} = require("../../../models/task/task.model");
const {responseError, responseData} = require("../../../utils/responseHandler");

exports.create = async (req, res) => {
    try {
        const body = req.body;
        const media = req.media;
        const authData = req.authData;

        const task = await taskTable({
            is_remove: false,
            is_active: true,
            mentor_id: authData.user_id,
            type: 'quiz',
            task_id: req.params.id
        })

        if (task.length === 0) {
            responseError(res, 400, [], 'tidak ada data')
            return;
        }

        const qq = await quizQuestionTable({
            quiz_question_id: req.params.id2,
            task_id: task[0].id
        })

        if (qq.length === 0) {
            responseError(res, 400, [], 'tidak ada data')
            return;
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

exports.delete = async (req, res) => {
    try {
        const body = req.body;

        const question = await quizQuestionTable({
            task_id: body.task_id,
            quiz_question_id: body.question_id,
            type: 'quiz'
        })
        if (question.length === 0) {
            responseError(res, 400, 'tidak ada')
        }

        const remove = await deleteOption({
            id: body.option_id,
            question_id: question[0].id,
        })

        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err);
    }
}