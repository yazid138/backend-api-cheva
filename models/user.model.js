const {Database} = require("../config/database");

exports.userTable = async params => {
    const user = new Database('user');

    user.select('*, user.id, p.name user_name, d.name div_name, r.name role_name');
    user.join('profile p', 'user.id = p.id');
    user.join('`div` d', 'p.div_id = d.id');
    user.join('role r', 'p.role_id = r.id');
    user.join('media m', 'm.id = p.media_id', 'LEFT JOIN');

    if (params.user_id) {
        user.where('user.id', '?');
        user.bind(params.user_id);
    }
    if (params.username) {
        user.where('user.username', '?');
        user.bind(params.username);
    }
    if (params.name) {
        user.where('p.name', '?', 'AND', 'LIKE');
        user.bind(`%${params.name}%`);
    }
    if (params.div_id) {
        user.where('p.div_id', '?');
        user.bind(params.div_id);
    }
    if (params.role_id) {
        user.where('p.role_id', '?')
        user.bind(params.role_id);
    }
    if (params.role_name) {
        user.where('r.name', '?');
        user.bind(params.role_name);
    }

    return new Promise((resolve, reject) => {
        user.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

exports.insertUser = data => {
    const user = new Database('user');

    return new Promise((resolve, reject) => {
        user.insert(data, (err, result) => {
            if (err) reject(err);
            data = {
                id: result.insertId,
                result,
            }
            resolve(data);
        });
    })
}