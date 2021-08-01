const {Database} = require("../config/database");

exports.roleTable = async params => {
    const role = new Database('role');

    role.select('*');

    if (params.role_id) {
        role.where('id', '?');
        role.bind(params.role_id);
    }
    if (params.role_name) {
        role.where('name', '?');
        role.bind(params.role_name);
    }

    return new Promise((resolve, reject) => {
        role.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}