const {Database} = require('../../../config/database');

exports.quizAnswerTable = params => {
    let db = new Database('quiz_answer qa');

    db.select('*');

    if (params.select) {
        db = new Database('quiz_answer qa');
        db.select(params.select);
    }

    db.join('task_student ts', 'qa.task_student_id = ts.id');
    db.join('quiz_question qq', 'qa.quiz_question_id = qq.id');

    if (params.media_id) {
        db.where('qa.id', '?');
        db.bind(params.media_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertQuizAnswer = data => {
    const db = new Database('quiz_answer');

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