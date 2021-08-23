const {userTable} = require("../../models/user.model");
const {insertPresence} = require("../../models/studygroup/presence.model");
const {
    linkTable,
    updateLink,
    insertLink
} = require("../../models/link.model");
const {
    insertStudyGroup,
    studyGroupTable,
    updateStudyGroup
} = require('../../models/studygroup/studygroup.model');
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");
const {
    check,
    validationResult
} = require("express-validator");

exports.getStudyGroup = async (req, res) => {
    try {
        const authData = req.authData;
        const query = req.query;
        const page = query.page || 1;
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

        if (query.order_by) {
            params.order_by = query.order_by;
            params.ascdesc = query.ascdesc || 'ASC';
        }

        let sg = await studyGroupTable(params);
        const totalData = sg.length;
        if (sg.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        if (query.limit) {
            const startIndex = (parseInt(page) - 1) * parseInt(query.limit);
            const endIndex = parseInt(page) * query.limit;
            sg = sg.slice(startIndex, endIndex);
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
                video_uri: null,
                media: {
                    id: e.media_id,
                    label: e.label,
                    uri: e.uri,
                }
            }
            if (e.link_id) {
                const link = await linkTable({link_id: e.link_id});
                data.video_uri = link[0].uri
            }

            return data;
        }))

        if (query.limit) {
            responseData(res, 200, data, totalData, {
                current_page: parseInt(page),
                limit: parseInt(query.limit),
                max_page: Math.ceil(totalData / parseInt(query.limit))
            });
            return
        }
        responseData(res, 200, data, totalData);
    } catch (err) {
        responseError(res, 400, err.message);
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
            div_id: authData.div_id, role_id: 2
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

exports.addVideoStudyGroup = [
    check('url')
        .notEmpty().withMessage('masukkan url')
        .bail()
        .isURL().withMessage('bukan url')
    , async (req, res) => {
        try {
            const body = req.body;
            const authData = req.authData;

            const sg = await studyGroupTable({
                studygroup_id: req.params.id,
                mentor_id: authData.user_id
            })

            if (sg.length === 0) {
                responseError(res, 400, [], 'tidak ada data');
                return;
            }

            if (sg[0].link_id) {
                responseError(res, 400, [], 'link sudah ada, harap update');
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
            }

            let data = {
                uri: body.url,
                created_at: new Date(),
                updated_at: new Date(),
            }

            const link = await insertLink(data);

            data = {
                link_id: link.id,
                is_active: false,
                updated_at: new Date()
            }
            const update = await updateStudyGroup(data, sg[0].id);

            if (update.affectedRows < 1) {
                responseError(res, 400, [], 'gagal');
            }

            responseData(res, 200, 'berhasil masukin video');
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.editVideoStudyGroup = [
    check('url')
        .notEmpty().withMessage('masukkan url')
        .bail()
        .isURL().withMessage('bukan url')
    , async (req, res) => {
        try {
            const body = req.body;
            const authData = req.authData;

            const sg = await studyGroupTable({
                studygroup_id: req.params.id,
                mentor_id: authData.user_id
            })

            if (sg.length === 0) {
                responseError(res, 400, [], 'tidak ada data');
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
            }

            const update = await updateLink({
                uri: body.url,
                updated_at: new Date(),
            }, sg[0].link_id);

            if (update.affectedRows < 1) {
                responseError(res, 400, [], 'gagal');
            }

            responseData(res, 200, 'berhasil ubah video');
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]