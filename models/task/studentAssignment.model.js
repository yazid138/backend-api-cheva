const {Database} = require('../../config/database');

exports.studentAssignmentTable = params => {
    const db = new Database('student_assignment sa');

    db.select('sa.id, sa.task_student_id, sa.link_id, l.uri');
    db.join('task_student ts', 'sa.task_student_id = ts.id');
    db.join('link l', 'sa.link_id = l.id');

    if (params.student_assignment_id) {
        db.where('sa.id', '?');
        db.bind(params.student_assignment_id);
    }
    if (params.task_student_id) {
        db.where('sa.task_student_id', '?');
        db.bind(params.task_student_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertStudentAssignment = data => {
    const db = new Database('student_assignment');

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

exports.updateStudentAssignment = (data, condition) => {
    const db = new Database('student_assignment');
    db.update(data);

    if (typeof condition === 'object') {
        if (params.id) {
            db.where('id', '?');
            db.bind(params.id);
        }
        if (params.task_student_id) {
            db.where('task_student_id', '?');
            db.bind(params.task_student_id);
        }
    } else {
        db.where('id');
        db.bind(condition);
    }

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