const {Database} = require("../config/database");

exports.roleTable = async params => {
    const db = new Database('role');

    db.select('*');

    if (params.role_id) {
        db.where('id', '?');
        db.bind(params.role_id);
    }
    if (params.role_name) {
        db.where('name', '?');
        db.bind(params.role_name);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}