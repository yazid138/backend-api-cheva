const {validationResult} = require("express-validator");
const {mediaTable} = require("../../models/media.model");
const {courseProgressTable} = require("../../models/course/courseProgress.model");
const {
    courseGlossaryTable,
    insertCourseGlossary
} = require("../../models/course/courseGlossary.model");
const {
    courseChapterTable,
    insertCourseChapter
} = require("../../models/course/courseChapter.model");
const {
    chapterTable,
    insertChapter
} = require("../../models/course/chapter.model");
const {
    courseTable,
    insertCourse
} = require('../../models/course/course.model');
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.getCourse = async (req, res) => {
    try {
        const query = req.query;
        const params = {};

        if (query.course_id) {
            params.course_id = query.course_id;
        }
        if (query.is_active) {
            params.is_active = query.is_active;
        }

        const course = await courseTable(params);

        if (course.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
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

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.createCourse = async (req, res) => {
    try {
        const authData = req.authData;
        const body = req.body;
        const id_image = req.media.id;

        const data = {
            title: body.title,
            description: body.description,
            created_at: new Date(),
            updated_at: new Date(),
            media_id: id_image,
            mentor_id: authData.user_id,
            div_id: authData.div_id,
        }

        const course = await insertCourse(data);
        responseData(res, 201, course);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.createGlossary = async (req, res) => {
    const body = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        responseError(res, 400, errors.array());
        return;
    }

    const data = {
        title: body.title,
        description: body.description,
        course_id: body.course_id,
    }

    const glossary = await insertCourseGlossary(data);
    responseData(res, 200, glossary);
}

exports.createChapter = async (req, res) => {
    try {
        const body = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseError(res, 400, errors.array());
            return;
        }

        const data = {
            title: body.title,
            course_id: body.course_id,
        }
        const cc = await insertCourseChapter(data);
        responseData(res, 200, cc);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.addSection = async (req, res) => {
    try {
        const body = req.body;
        const link = req.link;

        const data = {
            title: body.title,
            content: body.content,
            course_chapter_id: body.chapter_id,
            link_id: link.id,
        }

        const section = await insertChapter(data);

        responseData(res, 200, section);
    } catch (err) {
        responseError(res, 400, err);
    }
}