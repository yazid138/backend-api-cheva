const validate = require("../../middleware/validation");
const cek = require("../../utils/cekTable");
const {editMedia} = require("../../utils/helper");
const {mediaTable} = require("../../models/media.model");
const {deleteMedia} = require("../../utils/helper");
const {deleteCourse, updateCourse} = require("../../models/course/course.model");
const {uploadValidation} = require("../../utils/fileUpload");
const {validationResult} = require("express-validator");
const {addMedia} = require("../../utils/helper");
const {courseProgressTable} = require("../../models/course/courseProgress.model");
const {courseGlossaryTable} = require("../../models/course/courseGlossary.model");
const {courseChapterTable} = require("../../models/course/courseChapter.model");
const {chapterTable} = require("../../models/course/chapter.model");
const {courseTable, insertCourse} = require('../../models/course/course.model');
const {responseError, responseData} = require("../../utils/responseHandler");

exports.list = async (req, res) => {
    try {
        const query = req.query;
        const page = query.page || 1;
        const params = {};

        if (req.params.id) {
            params.course_id = req.params.id;
        }

        if (query.is_active && !req.params.id) {
            params.is_active = query.is_active;
        }

        if (query.order_by && !req.params.id) {
            params.order_by = query.order_by;
            params.ascdesc = query.ascdesc || 'ASC';
        }

        let course = await courseTable(params);
        const totalData = course.length;
        if (course.length === 0 && req.params.id) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        if (query.limit && !req.params.id) {
            const startIndex = (parseInt(page) - 1) * parseInt(query.limit);
            const endIndex = parseInt(page) * query.limit;
            course = course.slice(startIndex, endIndex);
        }

        const data = await Promise.all(course.map(async e => {
            const data = {
                course_id: e.id,
                title: e.title,
                description: e.description,
                total_reader: 0,
                created_at: e.created_at,
                updated_at: e.updated_at,
                mentor: {
                    name: e.mentor_name,
                    div: e.div_name,
                },
                media: {
                    id: e.media_id,
                    label: e.label,
                    uri: e.uri,
                },
            }
            const chapter = await courseChapterTable({course_id: e.id});
            data.chapter = chapter;
            if (chapter.length !== 0) {
                data.chapter = await Promise.all(chapter.map(async e => {
                    const data = {
                        id: e.id,
                        title: e.title,
                    }
                    let section = await chapterTable({course_chapter_id: e.id});
                    if (section.length !== 0) {
                        section = section.map(e => {
                            return {
                                id: e.id,
                                title: e.title,
                                body: e.content,
                                link: {
                                    id: e.link_id,
                                    uri: e.uri,
                                }
                            }
                        })
                    }
                    data.section = section;
                    return data;
                }))
            }
            const total = await courseProgressTable({
                select: 'COUNT(DISTINCT user_id) total',
                course_id: e.id
            });
            data.total_reader = total[0].total;
            const glossary = await courseGlossaryTable({course_id: e.id});
            data.glossary = glossary;
            if (glossary.length !== 0) {
                data.glossary = glossary.map(e => {
                    return {
                        id: e.id,
                        title: e.title,
                        description: e.description,
                    };
                })
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
        responseData(res, 200, data, totalData, {
            current_page: parseInt(page)
        });
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.create = [
    validate.infoSchema,
    validate.mediaSchema,
    async (req, res) => {
        try {
            const authData = req.authData;
            const body = req.body;
            const file = req.files;

            if (!file || !file.media) {
                responseError(res, 400, [], 'file media harus di upload');
                return;
            }

            const fileValidation = uploadValidation(file.media);
            if (!fileValidation.success) {
                responseError(res, 400, [], fileValidation.result);
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

            const data = {
                title: body.title,
                description: body.description,
                created_at: new Date(),
                updated_at: new Date(),
                media_id: media.id,
                mentor_id: authData.user_id,
                div_id: authData.div_id,
            }

            const course = await insertCourse(data);
            responseData(res, 201, course);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]

exports.edit = async (req, res) => {
    try {
        const body = req.body;

        const course = await cek.course(req, res);

        const data = {
            updated_at: new Date()
        }

        if (body.title) {
            data.title = body.title;
        }

        if (body.description) {
            data.description = body.description;
        }

        const update = await updateCourse(data, course[0].id);

        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.delete = async (req, res) => {
    try {
        const course = await cek.course(req, res);

        const del = await deleteCourse(course[0].id);

        await deleteMedia(course[0].media_id);

        responseData(res, 200, del);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}

exports.editMedia = async (req, res) => {
    try {
        const body = req.body;
        const file = req.files;

        const course = await cek.course(req, res);

        if (!file || !file.media) {
            responseError(res, 400, [], 'tidak ada file media');
            return;
        }

        const fileValidation = uploadValidation(file.media);
        if (!fileValidation.success) {
            responseError(res, 400, [], fileValidation.result);
            return;
        }

        const media = await mediaTable({
            media_id: course[0].media_id
        })

        const data = {
            file: file.media,
            path: media[0].uri,
        };

        if (body.media_label) {
            data.label = body.media_label;
        }

        const update = await editMedia(res, course[0].media_id, data)

        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}