const {Database} = require('../../config/database');

exports.chapterTable = params => {
    const db = new Database('chapter c');

    db.select('c.id, c.title, c.content, c.link_id, l.uri, c.course_chapter_id');
    db.join('course_chapter cc', 'c.course_chapter_id = cc.id');
    db.join('link l', 'c.link_id = l.id');

    if (params.course_chapter_id) {
        db.where('c.course_chapter_id', '?');
        db.bind(params.course_chapter_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertChapter = data => {
    const db = new Database('chapter');

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