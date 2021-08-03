const {presenceTable} = require("../../models/studygroup/presence.model");
const {studyGroupTable} = require('../../models/studygroup/studygroup.model');
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.getStudyGroup = async (req, res) => {
    try {
        const query = req.query;
        const params = {};

        if (query.studygroup_id) {
            params.studygroup_id = query.studygroup_id;
        }

        const sg = await studyGroupTable(params);

        if (sg.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
        }

        const data = await Promise.all(sg.map(async e => {
            const data = {
                studygroup_id: e.id,
                title: e.title,
                description: e.description,
                time_start: e.time_start,
                time_end: e.time_end,
                created_at: e.created_at,
                updated_at: e.updated_at,
                is_active: e.is_active,
                mentor: {
                    id: e.mentor_id,
                    name: e.mentor_name,
                    div: {
                        id: e.div_id,
                        name: e.div_name,
                    },
                },
                media: {
                    id: e.media_id,
                    label: e.label,
                    uri: e.uri,
                }
            }
            const presence = await presenceTable({studygroup_id: e.id});
            data.presence = presence.map(e => {
                return {
                    id: e.id,
                    hadir: Boolean(e.status),
                    student: {
                        id: e.student_id,
                        name: e.student_name,
                    },
                }
            })

            return data;
        }))

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}