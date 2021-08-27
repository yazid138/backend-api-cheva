const {insertQuizAnswer, updateQuestionAnswer, quizAnswerTable} = require("../../../models/task/quiz/quizAnswer.model");
const {quizOptionTable} = require("../../../models/task/quiz/quizOption.model");
const {taskStudentTable} = require("../../../models/task/taskStudent.model");
const {taskTable} = require("../../../models/task/task.model");
const {responseData, responseError} = require("../../../utils/responseHandler");
const {validationResult} = require("express-validator");

exports.list = async (req, res) => {
    try {
        const authData = req.authData;
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

        const paramsStudent = {
            task_id: task[0].id
        }

        if (authData.role_id === 2) {
            paramsStudent.student_id = authData.user_id;
        }

        const ts = await taskStudentTable(paramsStudent);
        const data = {
            task_id: task[0].id
        }
        data.student = await Promise.all(ts.map(async e => {
            const data = {
                id: e.student_id,
                name: e.student_name,
                div: e.div_name
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


        responseData(res, 200, data);
    } catch
        (err) {
        responseError(res, 400, err.message);
    }
}

exports.add = async (req, res) => {
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

exports.edit = async (req, res) => {
    try {
        const body = req.body;
        const authData = req.authData;

        const ts = await taskStudentTable({
            student_id: authData.user_id,
            task_id: body.task_id,
            status_id: 1,
            type: 'quiz'
        })

        if (ts.length === 0) {
            responseError(res, 400, 'tidak ada');
        }

        const option = await quizOptionTable({
            quiz_option_id: body.option_id,
            quiz_question_id: body.question_id
        })

        if (option.length === 0) {
            responseError(res, 400, 'tidak ada option');
        }

        const update = await updateQuestionAnswer({
            quiz_option_id: option[0].id
        }, {
            task_student_id: ts[0].id,
            question_id: body.question_id
        });

        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}