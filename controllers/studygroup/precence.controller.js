const {studyGroupTable} = require('../../models/studygroup/studygroup.model');
const {presenceTable} = require("../../models/studygroup/presence.model");
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");
const {validationResult} = require("express-validator");

exports.getPresence = async (req, res) => {
    try {
        const query = req.query;
        const authData = req.authData;
        const params = {}

        if (authData.role_id === 1) {
            params.mentor_id = authData.user_id;
        }

        if (req.params.id) {
            params.studygroup_id = req.params.id;
        }

        params.div_id = authData.div_id;

        const sg = await studyGroupTable(params)

        const data = await Promise.all(sg.map(async e => {
            const data = {
                studygroup_id: e.id
            }
            const presence = await presenceTable({studygroup_id: e.id});
            data.presence = presence.map(e => {
                return {
                    student: {
                        id: e.student_id,
                        name: e.student_name,
                    },
                    hadir: Boolean(e.status),
                }
            })
            return data;
        }))

        if (sg.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}

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