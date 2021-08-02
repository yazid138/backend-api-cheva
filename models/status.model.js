const {Database} = require("../config/database");

exports.statusTable = params => {
    const db = new Database('status');

    db.select('*');

    if (params.status_id) {
        db.where('id', '?');
        db.bind(params.status_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}