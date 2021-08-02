const {questionOptionTable} = require("../../models/task/quiz/questionOption.model");
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
                }
                const options = await questionOptionTable({quiz_question_id: e.id});
                data.options = options.map(e => {
                    return {
                        id: e.id,
                        value: e.value,
                        is_true: Boolean(e.is_true),
                    }
                });

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