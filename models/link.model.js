const {Database} = require("../config/database");

exports.linkTable = params => {
    const link = new Database('link');

    link.select('*');

    if (params.link_id) {
        link.where('id', '?');
        link.bind(params.link_id);
    }

    return new Promise((resolve, reject) => {
        link.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertLink = data => {
    const link = new Database('link');

    return new Promise((resolve, reject) => {
        link.insert(data, (err, result) => {
            if (err) reject(err);
            data = {
                id: result.insertId,
                result,
            }
            resolve(data);
        })
    })
}