const {Database} = require("../config/database");

exports.mediaTable = params => {
    const media = new Database('media');

    media.select('*');

    if (params.media_id) {
        media.where('id', '?');
        media.bind(params.media_id);
    }

    return new Promise((resolve, reject) => {
        media.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertMedia = data => {
    const media = new Database('media');

    return new Promise((resolve, reject) => {
        media.insert(data, (err, result) => {
            if (err) reject(err);
            data = {
                id: result.insertId,
                result,
            }
            resolve(data);
        })
    })
}