const {Database} = require('../../../config/database');

exports.quizAnswerTable = (params = {} ) => {
    let db = new Database('quiz_answer qa');
    db.select('qa.id, qa.task_student_id, qa.quiz_option_id, qa.quiz_question_id, qo.is_true, qo.value answer, qq.question');

    if (params.select) {
        db = new Database('quiz_answer qa');
        db.select(params.select);
    }

    db.join('task_student ts', 'qa.task_student_id = ts.id');
    db.join('quiz_question qq', 'qa.quiz_question_id = qq.id');
    db.join('quiz_option qo', 'qa.quiz_option_id = qo.id');

    if (params.answer_id) {
        db.where('qa.id', '?');
        db.bind(params.answer_id);
    }
    if (params.task_id) {
        db.where('ts.task_id', '?');
        db.bind(params.task_id);
    }
    if (params.task_student_id) {
        db.where('qa.task_student_id', '?');
        db.bind(params.task_student_id);
    }
    if (params.question_id) {
        db.where('qa.quiz_question_id', '?');
        db.bind(params.question_id);
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

exports.updateQuestionAnswer = (data, id) => {
    const db = new Database('quiz_answer');

    db.update(data);
    db.where('id')
    db.bind(id)

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}