const {Database} = require("../../config/database");

exports.presenceTable = params => {
    const db = new Database('presence pr');

    db.select('pr.id, pr.status, pr.studygroup_id, pr.student_id, p.name student_name');
    db.join('profile p', 'pr.student_id = p.id');
    db.join('studygroup getStudyGroup', 'pr.studygroup_id = getStudyGroup.id');

    if (params.presence_id) {
        db.where('pr.id', '?');
        db.bind(params.presence_id);
    }
    if (params.studygroup_id) {
        db.where('pr.studygroup_id', '?');
        db.bind(params.studygroup_id);
    }
    if (params.student_id) {
        db.where('pr.student_id', '?');
        db.bind(params.student_id);
    }

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

exports.insertPresence = data => {
    const db = new Database('presence');

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

exports.updatePresence = (data, condition) => {
    const db = new Database('presence');
    db.update(data);

    db.where('id', '?');
    db.bind(condition.presence_id);

    db.where('studygroup_id', '?');
    db.bind(condition.studygroup_id);

    return new Promise((resolve, reject) => {
        db.result((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}