const {Database} = require("../../config/database");

exports.courseTable = (params = {}) => {
    const db = new Database('course c');

    db.select('c.id, c.mentor_id, c.div_id, c.media_id, c.title, c.description, c.created_at, c.updated_at, p.name mentor_name, d.name div_name, m.label, m.uri, c.is_active');
    db.join('profile p', 'c.mentor_id = p.id');
    db.join('`div` d', 'c.div_id = d.id');
    db.join('media m', 'c.media_id = m.id');

    if (params.course_id) {
        db.where('c.id', '?');
        db.bind(params.course_id);
    }
    if (params.mentor_id) {
        db.where('c.mentor_id', '?');
        db.bind(params.mentor_id);
    }
    if (params.is_active) {
        db.where('c.is_active', '?');
        db.bind(params.is_active);
    }
    if (params.order_by) {
        db.order(params.order_by, params.ascdesc);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertCourse = data => {
    const db = new Database('course');

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

exports.updateCourse = (data, condition) => {
    const db = new Database('course');
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

exports.deleteCourse = condition => {
    const db = new Database('course');
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