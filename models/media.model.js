const {Database} = require("../config/database");

exports.mediaTable = params => {
    const db = new Database('media m');

    db.select('*');
    if (params.media_id) {
        db.where('m.id', '?');
        db.bind(params.media_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertMedia = data => {
    const db = new Database('media');

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

exports.updateMedia = (data, id) => {
    const db = new Database('media');
    db.update(data)

    db.where('id');
    db.bind(id)

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}