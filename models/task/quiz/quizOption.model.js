const {Database} = require('../../../config/database');

exports.quizOptionTable = (params = {}) => {
    const db = new Database('quiz_option qo');

    db.select('qo.id, qo.value, qo.quiz_question_id, qo.is_true, qo.media_id');
    db.join('quiz_question qq', 'qo.quiz_question_id = qq.id');

    if (params.quiz_option_id) {
        db.where('qo.id', '?');
        db.bind(params.quiz_option_id);
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

exports.insertQuizOption = data => {
    const db = new Database('quiz_option');

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

exports.updateOption = (data, condition) => {
    const db = new Database('quiz_option');

    db.update(data);
    if (typeof condition === 'object') {
        if (condition.id) {
            db.where('id')
            db.bind(condition.id)
        }
    } else {
        db.where('id')
        db.bind(condition)
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

exports.deleteOption = (condition) => {
    const db = new Database('quiz_option');
    db.delete()

    if (typeof condition === 'object') {
        if (condition.id) {
            db.where('id')
            db.bind(condition.id)
        }
        if (condition.question_id) {
            db.where('quiz_question_id')
            db.bind(condition.question_id)
        }
    } else {
        db.where('id')
        db.bind(condition)
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}
