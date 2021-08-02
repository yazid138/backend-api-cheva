const {Database} = require('../../../config/database');

exports.questionOptionTable = (params = {}) => {
    const db = new Database('question_option qo');

    db.select('qo.id, qo.value, qo.quiz_question_id, qo.is_true, qo.media_id');
    db.join('quiz_question qq', 'qo.quiz_question_id = qq.id');

    if (params.question_option_id) {
        db.where('qo.id', '?');
        db.bind(params.question_option_id);
    }
    if (params.quiz_question_id) {
        db.where('qo.quiz_question_id', '?');
        db.bind(params.quiz_question_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertQuestionOption = data => {
    const db = new Database('question_option');

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
