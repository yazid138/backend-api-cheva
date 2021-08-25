const {Database} = require("../config/database");

exports.profileTable = (params = {}) => {
    const db = new Database('profile p');

    db.select('p.id, p.name, p.div_id, p.role_id, p.media_id, d.name div_name, r.name role_name, m.uri, m.label, p.created_at, p.updated_at');

    db.join('`div` d', 'p.div_id = d.id');
    db.join('role r', 'p.role_id = r.id');
    db.join('media m', 'p.media_id = m.id', 'LEFT');

    if (params.user_id) {
        db.where('p.id');
        db.bind(params.user_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertProfile = data => {
    const db = new Database('profile');

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

exports.updateProfile = (data, condition) => {
    const db = new Database('profile');
    db.update(data);

    if (typeof condition === 'object') {
        if (condition.id) {
            db.where('id', '?');
            db.bind(condition.id);
        }
    } else {
        db.where('id', '?');
        db.bind(condition);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            data = {
                id: result.insertId,
                result,
            }
            resolve(data);
        });
    })
}