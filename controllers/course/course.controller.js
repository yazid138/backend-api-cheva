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

        if (query.course_id) {
            params.course_id = query.course_id;
        }
        if (query.is_active) {
            params.is_active = query.is_active;
        }
        if (query.order_by) {
            params.order_by = query.order_by;
            params.ascdesc = query.ascdesc || 'ASC';
        }

        let course = await courseTable(params);
        const totalData = course.length;
        if (course.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        if (query.limit) {
            const startIndex = (parseInt(page) - 1) * parseInt(query.limit);
            const endIndex = parseInt(page) * query.limit;
            course =  course.slice(startIndex, endIndex);
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

exports.create = async (req, res) => {
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