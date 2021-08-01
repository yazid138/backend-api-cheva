const {Database} = require("../config/database");

exports.statusTable = params => {
    const status = new Database('status');

    status.select('*');

    if (params.status_id) {
        status.where('id', '?');
        status.bind(params.status_id);
    }

    return new Promise((resolve, reject) => {
        status.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}