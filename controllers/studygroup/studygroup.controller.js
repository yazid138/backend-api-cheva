const cek = require('../../utils/cekTable');
const {deleteLink} = require("../../models/link.model");
const {deleteMedia} = require("../../utils/helper");
const {uploadValidation} = require("../../utils/fileUpload");
const {mediaTable} = require("../../models/media.model");
const {addLink, editMedia, addMedia} = require("../../utils/helper");
const {userTable} = require("../../models/user.model");
const {insertPresence} = require("../../models/studygroup/presence.model");
const {linkTable, updateLink} = require("../../models/link.model");
const {responseError, responseData} = require("../../utils/responseHandler");
const {mediaSchema, sgSchema, infoSchema} = require("../../middleware/validation");
const {check, validationResult} = require("express-validator");
const {
    insertStudyGroup,
    studyGroupTable,
    updateStudyGroup,
    deleteStudyGroup
} = require('../../models/studygroup/studygroup.model');

exports.list = async (req, res) => {
    try {
        const authData = req.authData;
        const query = req.query;
        const page = query.page || 1;
        const params = {};

        params.div_id = authData.div_id;

        if (authData.role_id === 1) {
            params.mentor_id = authData.user_id;
        }

        if (query.is_active) {
            params.is_active = query.is_active === 'true' || query.is_active;
        }

        if (query.order_by) {
            params.order_by = query.order_by;
            params.ascdesc = query.ascdesc || 'ASC';
        }

        if (req.params.id) {
            params.studygroup_id = req.params.id;
        }

        let sg = await studyGroupTable(params);
        const totalData = sg.length;
        if (sg.length === 0 && req.params.id) {
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
                meet_uri: null,
                video_uri: null,
                media: {
                    id: e.media_id,
                    label: e.label,
                    uri: e.uri,
                }
            }
            if (e.meet_id) {
                const link = await linkTable({link_id: e.meet_id});
                data.meet_uri = link[0].uri
            }
            if (e.video_id) {
                const link = await linkTable({link_id: e.video_id});
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

exports.create = [
    infoSchema,
    sgSchema,
    check('link_meet')
        .optional()
        .bail()
        .isURL().withMessage('format bukan URL')
    ,
    mediaSchema,
    async (req, res) => {
        try {
            const body = req.body;
            const file = req.files;
            const authData = req.authData;

            if (!file || !file.media) {
                responseError(res, 400, [], 'file media harus di upload');
                return;
            }

            const fileValidation = uploadValidation(file.media);
            if (!fileValidation.success) {
                responseError(res, 400, [],fileValidation.result);
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const media = await addMedia(res, {
                file: file.media,
                label: body.media_label
            });
            let link = {};
            if (body.link_meet) {
                link = await addLink(body.link_meet);
            }

            let data = {
                title: body.title,
                description: body.description,
                time_start: body.time_start,
                time_end: body.time_end,
                meet_id: link.id ? link.id : null,
                created_at: new Date(),
                updated_at: new Date(),
                mentor_id: authData.user_id,
                div_id: authData.div_id,
                media_id: media.id,
            }

            const sg = await insertStudyGroup(data);
            const students = await userTable({
                div_id: authData.div_id,
                role_id: 2
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
                studygroup: sg,
                student: presence
            }
            responseData(res, 201, result);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]

exports.edit = async (req, res) => {
    try {
        const authData = req.authData;

        const sg = await cek.studygroup(req, res);

        const body = req.body;

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
        if (body.link_meet) {
            const link = await linkTable({
                link_id: sg[0].meet_id
            })
            if (link.length !== 1) {
                const l = await addLink(body.link_meet);
                data.meet_id = l.id;
            } else {
                await updateLink({
                    uri: body.link_meet,
                    updated_at: new Date(),
                }, sg[0].meet_id);
            }
        }

        const update = await updateStudyGroup(data, {
            id: req.params.id,
            mentor_id: authData.user_id
        });

        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.remove = async (req, res) => {
    try {
        const sg = await cek.studygroup(req, res);

        const remove = await updateStudyGroup({
            is_active: false
        }, sg[0].id);

        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.delete = async (req, res) => {
    try {
        const sg = await cek.studygroup(req, res);

        const remove = await deleteStudyGroup(sg[0].id);

        await deleteMedia(sg[0].media_id);

        if (sg[0].meet_id) await deleteLink(sg[0].meet_id);
        if (sg[0].video_id) await deleteLink(sg[0].video_id);

        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.editMedia = async (req, res) => {
    try {
        const body = req.body;
        const file = req.files;

        const sg = await cek.studygroup(req, res);

        if (!file || !file.media) {
            responseError(res, 400, [], 'tidak ada file media');
            return;
        }

        const fileValidation = uploadValidation(file.media);
        if (!fileValidation.success) {
            responseError(res, 400, [],fileValidation.result);
            return;
        }

        const media = await mediaTable({
            media_id: sg[0].media_id
        })

        const data = {
            file: file.media,
            path: media[0].uri,
        };

        if (body.media_label) {
            data.label = body.media_label;
        }

        const update = await editMedia(res, sg[0].media_id, data)

        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}