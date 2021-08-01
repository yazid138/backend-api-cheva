const {Database} = require("../config/database");

exports.divTable = async params => {
    const div = new Database('`div`');

    div.select('*');

    if (params.div_id) {
        div.where('id', '?');
        div.bind(params.div_id);
    }
    if (params.div_name) {
        div.where('name', '?');
        div.bind(params.div_name);
    }

    return new Promise((resolve, reject) => {
        div.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

exports.insertDiv = data => {
    const div = new Database('`div`');

    return new Promise((resolve, reject) => {
        div.insert(data, (err, result) => {
            if (err) reject(err);
            data = {
                id: result.insertId,
                result,
            }
            resolve(data);
        });
    })
}