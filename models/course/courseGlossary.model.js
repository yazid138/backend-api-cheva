const {Database} = require('../../config/database');

exports.courseGlossaryTable = params => {
    const db = new Database('course_glossary cg');

    db.select('cg.id, cg.title, cg.description, cg.course_id');
    db.join('course c', 'cg.course_id = c.id');

    if (params.course_id) {
        db.where('cg.course_id', '?');
        db.bind(params.course_id);
    }
    if (params.glossary_id) {
        db.where('cg.id', '?');
        db.bind(params.glossary_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertCourseGlossary = data => {
    const db = new Database('course_glossary');

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

exports.updateCourseGlossary = (data, condition) => {
    const db = new Database('course_glossary');
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

exports.deleteCourseGlossary = condition => {
    const db = new Database('course_glossary');
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