const {mediaTable} = require("../../models/media.model");
const {courseGlossaryTable} = require("../../models/course/courseGlossary.model");
const {chapterTable} = require("../../models/course/chapter.model");
const {courseChapterTable} = require("../../models/course/courseChapter.model");
const {courseTable} = require('../../models/course/course.model');
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

        const course = await courseTable(params);

        if (course.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
        }

        const data = await Promise.all(course.map(async e => {
            const data = {
                course_id: e.id,
                title: e.title,
                description: e.description,
                created_at: e.created_at,
                updated_at: e.updated_at,
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