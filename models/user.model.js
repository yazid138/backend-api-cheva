const {Database} = require("../config/database");

exports.userTable = async params => {
    const db = new Database('user');

    db.select('user.id, user.username, p.media_id, m.uri, m.label, user.password, p.div_id, p.role_id, p.name user_name, d.name div_name, r.name role_name');
    db.join('profile p', 'user.id = p.id');
    db.join('`div` d', 'p.div_id = d.id');
    db.join('role r', 'p.role_id = r.id');
    db.join('media m', 'm.id = p.media_id', 'LEFT');

    if (params.user_id) {
        db.where('user.id', '?');
        db.bind(params.user_id);
    }
    if (params.username) {
        db.where('user.username', '?');
        db.bind(params.username);
    }
    if (params.name) {
        db.where('p.name', '?', 'AND', 'LIKE');
        db.bind(`%${params.name}%`);
    }
    if (params.div_id) {
        db.where('p.div_id', '?');
        db.bind(params.div_id);
    }
    if (params.role_id) {
        db.where('p.role_id', '?')
        db.bind(params.role_id);
    }
    if (params.role_name) {
        db.where('r.name', '?');
        db.bind(params.role_name);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

exports.insertUser = data => {
    const db = new Database('user');

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