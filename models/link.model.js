const {Database} = require("../config/database");

exports.linkTable = params => {
    const db = new Database('link');

    db.select('*');

    if (params.link_id) {
        db.where('id', '?');
        db.bind(params.link_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertLink = data => {
    const db = new Database('link');

    return new Promise((resolve, reject) => {
        db.insert(data, (err, result) => {
            if (err) reject(err);
            data = {
                id: result.insertId,
                result,
            }
            resolve(data);
        })
    })
}