const {Database} = require("../config/database");

exports.divTable =  (params = {}) => {
    const db = new Database('`div`');

    db.select('*');

    if (params.div_id) {
        db.where('id', '?');
        db.bind(params.div_id);
    }
    if (params.div_name) {
        db.where('name', '?');
        db.bind(params.div_name);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

exports.insertDiv = data => {
    const db = new Database('`div`');

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