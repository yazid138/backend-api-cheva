const {Database} = require('../../config/database');

exports.courseProgressTable = params => {
    const db = new Database('course_progress cp');

    db.select('cp.id, cp.user_id, cp.chapter_id, cp.course_id, cp.progress, p.name user_name, d.name div_name, p.div_id');
    db.join('course c', 'cp.course_id = c.id');
    db.join('chapter', 'cp.chapter_id = chapter.id');
    db.join('profile p', 'cp.user_id = p.id');
    db.join('`div` d', 'p.div_id = d.id');

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertCourseProgress = data => {
    const db = new Database('course_progress');

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