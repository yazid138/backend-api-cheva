const {Database} = require("../config/database");

exports.taskTable = params => {
    const task = new Database('task');

    task.select('*');

    return new Promise((resolve, reject) => {
        task.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}