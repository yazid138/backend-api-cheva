const {Database} = require('../../config/database');

exports.courseProgressTable = params => {
    let db = new Database('course_progress cp');

    db.select('cp.id, cp.user_id, cp.section_id, cp.course_id, p.name user_name, d.name div_name, p.div_id, cp.chapter_id');

    if (params.select) {
        db = new Database('course_progress cp');
        db.select(params.select);
    }

    db.order('chapter_id, section_id');

    if (params.user_id) {
        db.where('cp.user_id');
        db.bind(params.user_id);
    }
    if (params.course_id) {
        db.where('cp.course_id');
        db.bind(params.course_id);
    }
    if (params.chapter_id) {
        db.where('cp.chapter_id');
        db.bind(params.course_id);
    }
    if (params.section_id) {
        db.where('cp.section_id');
        db.bind(params.section_id);
    }

    db.join('profile p', 'cp.user_id = p.id');
    db.join('`div` d', 'p.div_id = d.id');
    db.join('course c', 'cp.course_id = c.id');
    db.join('chapter', 'cp.chapter_id = chapter.id', 'RIGHT');

    if (params.course_id) {
        db.where('cp.course_id', '?');
        db.bind(params.course_id);
    }
    if (params.max) {
        db.where('cp.chapter_id', '(SELECT MAX(chapter_id) FROM course_progress)');
    }

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