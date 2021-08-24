const {Database} = require("../../config/database");

exports.studyGroupTable = (params = {}) => {
    const db = new Database('studygroup sg');

    db.select('sg.id, sg.title, sg.description, sg.mentor_id, sg.div_id, sg.media_id, sg.created_at, sg.updated_at, p.name mentor_name, d.name div_name, sg.time_start, sg.time_end, sg.is_active, m.label, m.uri, sg.meet_id, sg.video_id');
    db.join('profile p', 'sg.mentor_id = p.id');
    db.join('media m', 'sg.media_id = m.id');
    db.join('`div` d', 'sg.div_id = d.id');

    if (params.studygroup_id) {
        db.where('sg.id', '?');
        db.bind(params.studygroup_id);
    }
    if (params.mentor_id) {
        db.where('sg.mentor_id', '?');
        db.bind(params.mentor_id);
    }
    if (params.div_id) {
        db.where('sg.div_id', '?');
        db.bind(params.div_id);
    }
    if (params.is_active) {
        db.where('sg.is_active', '?');
        db.bind(params.is_active);
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

exports.updateStudyGroup = (data, condition) => {
    const db = new Database('studygroup');
    db.update(data);

    if (typeof condition === 'object') {
        if (condition.studygroup_id) {
            db.where('id', '?');
            db.bind(condition.studygroup_id);
        }

        if (condition.mentor_id) {
            db.where('mentor_id', '?');
            db.bind(condition.mentor_id);
        }
    } else {
        db.where('id', '?');
        db.bind(condition);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}