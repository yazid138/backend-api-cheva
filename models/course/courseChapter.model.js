const {Database} = require('../../config/database');

exports.courseChapterTable = params => {
    const db = new Database('course_chapter cc');

    db.select('cc.id, cc.title, cc.course_id');
    db.join('course c', 'cc.course_id = c.id');

    if (params.course_id) {
        db.where('cc.course_id', '?');
        db.bind(params.course_id);
    }
    if (params.course_chapter_id) {
        db.where('cc.id', '?');
        db.bind(params.course_chapter_id);
    }
    if (params.mentor_id) {
        db.where('c.mentor_id', '?');
        db.bind(params.mentor_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertCourseChapter = data => {
    const db = new Database('course_chapter');

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

exports.updateCourseChapter = (data, condition) => {
    const db = new Database('course_chapter');
    db.update(data);

    if (typeof condition === 'object') {
        if (condition.id) {
            db.where('id');
            db.bind(condition.id);
        }
    } else {
        db.where('id');
        db.bind(condition);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

exports.deleteCourseChapter = condition => {
    const db = new Database('course_chapter');
    db.delete()

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