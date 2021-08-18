const {Database} = require("../../config/database");

exports.taskTable = (params = {}) => {
    const db = new Database('task t');

    db.select('t.id, t.div_id, t.mentor_id, t.media_id, p.name mentor_name, d.name div_name, t.type, t.deadline, t.title, t.description, t.is_active, t.created_at, t.updated_at, m.label, m.uri');
    db.join('profile p', 't.mentor_id = p.id');
    db.join('`div` d', 't.div_id = d.id');
    db.join('media m', 't.media_id = m.id');

    if (params.task_id) {
        db.where('t.id', '?');
        db.bind(params.task_id);
    }
    if (params.type) {
        db.where('t.type', '?');
        db.bind(params.type);
    }
    if (params.mentor_id) {
        db.where('t.mentor_id', '?');
        db.bind(params.mentor_id);
    }
    if (params.is_active) {
        db.where('t.is_active', '?');
        db.bind(params.is_active);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertTask = data => {
    const db = new Database('task');

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

exports.updateTask = (data, condition) => {
    const db = new Database('task');
    db.update(data);

    if (typeof condition === 'object') {
        if (condition.id) {
            db.where('id', '?');
            db.bind(condition.id);
        }
        if (condition.mentor_id) {
            db.where('mentor_id', '?');
            db.bind(condition.mentor_id);
        }
    } else {
        db.where('id', '?');
        db.bind(condition);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}