const {Database} = require("../config/database");

exports.courseTable = params => {
    const course = new Database('course');

    course.select('*');

    return new Promise((resolve, reject) => {
        course.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}