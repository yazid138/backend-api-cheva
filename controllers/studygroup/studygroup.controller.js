const {userTable} = require("../../models/user.model");
const {linkTable} = require("../../models/link.model");
const {
    presenceTable,
    updatePresence,
    insertPresence
} = require("../../models/studygroup/presence.model");
const {
    insertStudyGroup,
    studyGroupTable,
    updateStudyGroup
} = require('../../models/studygroup/studygroup.model');
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");
const {validationResult} = require("express-validator");

exports.getStudyGroup = async (req, res) => {
    try {
        const authData = req.authData;
        const query = req.query;
        const params = {};

        if (authData.role_id === 1) {
            params.mentor_id = authData.user_id;
        }

        if (req.params.id) {
            params.studygroup_id = req.params.id;
        }

        params.div_id = authData.div_id;

        if (query.is_active) {
            params.is_active = query.is_active === 'true' || query.is_active;
        }

        const sg = await studyGroupTable(params);

        if (sg.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        const data = await Promise.all(sg.map(async e => {
            const now = Date.now();
            let created = new Date(e.created_at);
            created = created.setDate(created.getDate() + 1)
            if (now > created) {
                await updateStudyGroup({
                    is_active: false,
                    updated_at: new Date()
                }, e.id);
            }
            const data = {
                studygroup_id: e.id,
                title: e.title,
                description: e.description,
                time_start: e.time_start,
                time_end: e.time_end,
                created_at: e.created_at,
                updated_at: e.updated_at,
                is_active: Boolean(e.is_active),
                mentor: {
                    name: e.mentor_name,
                    div: e.div_name,
                },
                video: null,
                media: {
                    id: e.media_id,
                    label: e.label,
                    uri: e.uri,
                }
            }
            if (e.link_id) {
                const link = await linkTable({link_id: e.link_id});
                data.video = {
                    id: link[0].id,
                    uri: link[0].uri
                }
            }

            return data;
        }))

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.createStudyGroup = async (req, res) => {
    try {
        const authData = req.authData;
        const body = req.body;
        const id_image = req.media.id;

        const data = {
            title: body.title,
            description: body.description,
            time_start: body.time_start,
            time_end: body.time_end,
            created_at: new Date(),
            updated_at: new Date(),
            mentor_id: authData.user_id,
            div_id: authData.div_id,
            media_id: id_image,
        }

        const sg = await insertStudyGroup(data);
        const students = await userTable({
            div_id: authData.div_id, role_id:2
        })
        const presence = [];
        if (students.length > 0) {
            for (const e of students) {
                const data = {
                    studygroup_id: sg.id,
                    student_id: e.id,
                }
                const student = await insertPresence(data);
                presence.push(student)
            }
        }
        const result = {
            study_group: sg,
            student: presence
        }
        responseData(res, 201, result);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.editStudyGroup = async (req, res) => {
    try {
        const authData = req.authData;
        const body = req.body;
        const params = req.params;

        const data = {
            updated_at: new Date()
        };

        if (body.title) {
            data.title = body.title;
        }
        if (body.description) {
            data.description = body.description;
        }
        if (body.time_start) {
            data.time_start = body.time_start;
        }
        if (body.time_end) {
            data.time_end = body.time_end;
        }

        const update = await updateStudyGroup(data, {
            id: params.id,
            mentor_id: authData.user_id
        });

        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.removeStudyGroup = async (req, res) => {
    try {
        const authData = req.authData;
        const params = req.params;

        const sg = await studyGroupTable({
            studygroup_id: params.id,
            mentor_id: authData.user_id
        })

        if (sg.length === 0) {
            responseError(res, 400, [], 'tidak ada id');
            return;
        }

        const remove = await updateStudyGroup({
            is_active: false
        }, sg[0].id);

        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.addVideoStudyGroup = async (req, res) => {
    try {
        const body = req.body;
        const link = req.link;
        const authData = req.authData;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseError(res, 400, errors.array());
        }

        const data = {
            link_id: link.id,
            is_active: false,
            updated_at: new Date()
        }
        const sg = await updateStudyGroup(data, {
            studygroup_id: body.studygroup_id,
            mentor_id: authData.user_id
        });

        if (sg.affectedRows < 1) {
            responseError(res, 400, [], 'gagal');
        }

        responseData(res, 200, 'berhasil masukin video');
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.editVideoStudyGroup = async (req, res) => {
    try {
        const body = req.body;
        const link = req.link;
        const authData = req.authData;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseError(res, 400, errors.array());
        }

        const data = {
            link_id: link.id,
            updated_at: new Date()
        }

        const sg = await updateStudyGroup(data, {
            studygroup_id: body.studygroup_id,
            mentor_id: authData.user_id
        });

        if (sg.affectedRows < 1) {
            responseError(res, 400, [], 'gagal');
        }

        responseData(res, 200, 'berhasil ubah video');
    } catch (err) {
        responseError(res, 400, err);
    }
}

// exports.addPresence = async (req, res) => {
//     try {
//         const body = req.body;
//         const authData = req.authData;
//
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             responseError(res, 400, errors.array());
//             return;
//         }
//         const data = {
//             studygroup_id: body.studygroup_id,
//             student_id: body.student_id,
//             status: body.hadir,
//         }
//         const presence = await insertPresence(data);
//
//         responseData(res, 200, presence);
//     } catch (err) {
//         responseError(res, 400, err.message);
//     }
// }

exports.updatePresence = async (req, res) => {
    try {
        const body = req.body;
        const params = req.params;
        const autData = req.authData;

        const sg = await studyGroupTable({
            studygroup_id: params.id,
            mentor_id: autData.user_id
        })

        if (sg.length === 0) {
            responseError(res, 400, 'id tidak ada');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseError(res, 400, errors.array());
        }

        const data = {
            status: body.hadir,
        }
        const presence = await updatePresence(data, {
            student_id: body.student_id,
            studygroup_id: sg[0].id,
        });

        responseData(res, 200, presence);
    } catch (err) {
        responseError(res, 400, err);
    }
}