const {Database} = require("../config/database");

exports.sgTable = params => {
    const sg = new Database('studygroup');

    sg.select('*');

    return new Promise((resolve, reject) => {
        sg.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}