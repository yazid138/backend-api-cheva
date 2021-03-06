const {Database} = require('../../config/database');

exports.taskStudentTable = (params = {}) => {
    const db = new Database('task_student ts');

    db.select('ts.id, ts.score, ts.is_active, ts.status_id, s.value, ts.student_id, ts.task_id, p.name student_name, p.div_id, d.name div_name, t.type, t.deadline');
    db.join('status s', 'ts.status_id = s.id');
    db.join('profile p', 'ts.student_id = p.id');
    db.join('`div` d', 'p.div_id = d.id');
    db.join('task t', 'ts.task_id = t.id');

    if (params.task_student_id) {
        db.where('ts.id', '?');
        db.bind(params.task_student_id);
    }
    if (params.task_id) {
        db.where('ts.task_id', '?');
        db.bind(params.task_id);
    }
    if (params.student_id) {
        db.where('ts.student_id', '?');
        db.bind(params.student_id);
    }
    if (params.status_id) {
        db.where('ts.status_id', '?');
        db.bind(params.status_id);
    }
    if (params.type) {
        db.where('t.type', '?');
        db.bind(params.type);
    }
    if (params.div_id) {
        db.where('p.div_id', '?');
        db.bind(params.div_id);
    }
    if (params.deadline === true) {
        db.where('t.deadline', 'NOW()', 'AND', '<');
    } else if (params.deadline === false) {
        db.where('t.deadline', 'NOW()', 'AND', '>');
    }
    if (params.is_active) {
        db.where('ts.is_active', '?');
        db.bind(params.is_active);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertTaskStudent = data => {
    const db = new Database('task_student');

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

exports.updateTaskStudent = (data, condition) => {
    const db = new Database('task_student');

    db.update(data);

    if (typeof condition === 'object') {
        if (condition.id) {
            db.where('id')
            db.bind(condition.id)
        }
        if (condition.task_id) {
            db.where('task_id')
            db.bind(condition.task_id)
        }
        if (condition.student_id) {
            db.where('student_id')
            db.bind(condition.student_id)
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