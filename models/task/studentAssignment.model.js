const {Database} = require('../../config/database');

exports.studentAssignmentTable = params => {
    const db = new Database('student_assignment sa');

    db.select('*');
    db.join('task_student ts', 'sa.task_student_id = ts.id');
    db.join('getLink l', 'sa.link_id = l.id');

    if (params.student_assignment_id) {
        db.where('sa.id', '?');
        db.bind(params.student_assignment_id);
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