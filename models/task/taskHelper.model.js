const {Database} = require('../../config/database');

exports.taskHelperTable = params => {
    const db = new Database('task_helper th');

    db.select('*');
    db.join('task t', 'th.task_id = t.id');
    db.join('link l', 'th.link_id = l.id');

    if (params.task_helper_id) {
        db.where('th.id', '?');
        db.bind(params.task_helper_id);
    }
    if (params.task_id) {
        db.where('t.id', '?');
        db.bind(params.task_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertTaskHelper = data => {
    const db = new Database('task_helper');

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