const {Database} = require("../../../config/database");

exports.quizQuestionTable = (params = {}) => {
    const db = new Database('quiz_question qq');

    db.select('qq.id, qq.question, qq.task_id, qq.media_id');
    db.join('task t', 'qq.task_id = t.id');

    if (params.quiz_question_id) {
        db.where('qq.id', '?');
        db.bind(params.quiz_question_id);
    }
    if (params.task_id) {
        db.where('qq.task_id', '?');
        db.bind(params.task_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertQuizQuestion = data => {
    const db = new Database('quiz_question');

    return new Promise((resolve, reject) => {
        db.insert(data, (err, result) => {
            if (err) reject(err);
            data = {
                id: result.insertId,
                result,
            }
            resolve(data);
        });
    })
}