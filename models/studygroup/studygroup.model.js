const {Database} = require("../../config/database");

exports.studyGroupTable = params => {
    const db = new Database('studygroup sg');

    db.select('sg.id, sg.title, sg.description, sg.mentor_id, sg.div_id, sg.media_id, sg.created_at, sg.updated_at, p.name mentor_name, d.name div_name, sg.time_start, sg.time_end, sg.is_active, m.label, m.uri');
    db.join('profile p', 'sg.mentor_id = p.id');
    db.join('media m', 'sg.media_id = m.id');
    db.join('`div` d', 'sg.div_id = d.id');
    db.join('link l', 'sg.link_id = l.id', 'LEFT');

    if (params.studygroup_id) {
        db.where('sg.id', '?');
        db.bind(params.studygroup_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertStudyGroup = data => {
    const db = new Database('studygroup');

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