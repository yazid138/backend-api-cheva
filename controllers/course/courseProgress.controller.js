const {validationResult} = require("express-validator");
const {check} = require("express-validator");
const {insertCourseProgress} = require("../../models/course/courseProgress.model");
const {chapterTable} = require("../../models/course/chapter.model");
const {courseChapterTable} = require("../../models/course/courseChapter.model");
const {courseTable} = require("../../models/course/course.model");
const {courseProgressTable} = require("../../models/course/courseProgress.model");
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.list = async (req, res) => {
    try {
        const query = req.query;
        const authData = req.authData;
        const params = {};

        if (query.course_id) {
            params.course_id = query.course_id;
        }

        const course = await courseTable(params);

        if (course.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
            return;
        }

        const data = await Promise.all(course.map(async e => {
            const progress = await courseProgressTable({
                select: '(COUNT(cp.chapter_id)/ (SELECT COUNT(course.id)\n' +
                    '                             FROM course\n' +
                    '                                      JOIN course_chapter cc on course.id = cc.course_id\n' +
                    '                                      JOIN chapter c2 on cc.id = c2.course_chapter_id\n' +
                    '                             WHERE course.id = ' + e.id + ')) * 100 progress, (SELECT COUNT(course.id)\n' +
                    '                             FROM course\n' +
                    '                                      JOIN course_chapter cc on course.id = cc.course_id\n' +
                    '                                      JOIN chapter c2 on cc.id = c2.course_chapter_id\n' +
                    '                             WHERE course.id = ' + e.id + ') total',
                user_id: authData.user_id,
            })
            const data = {
                course_id: e.id,
                percent: progress[0].progress,
                total_section: progress[0].total,
            }
            const cp = await courseProgressTable({
                course_id: e.id,
                user_id: authData.user_id
            });
            data.progress = await Promise.all(cp.map(async e => {
                const data = {
                    chapter_id: e.chapter_id,
                    section_id: e.section_id,
                };

                return data;
            }))
            return data;
        }))

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.add = [
    check('course_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(async value => {
            const course = await courseTable({
                course_id: value,
                is_active: 1
            })

            if (course.length === 0) throw new Error('course id tidak ada')
        }),
    check('chapter_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(async (value, {req}) => {
            const chapter = await courseChapterTable({
                course_id: req.body.course_id,
                course_chapter_id: value
            })

            if (chapter.length === 0) throw new Error('chapter id tidak ada')
        }),
    check('section_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(async (value, {req}) => {
            const section = await chapterTable({
                course_chapter_id: req.body.chapter_id,
                chapter_id: value
            })

            if (section.length === 0) throw new Error('section id tidak ada')
        }),
    async (req, res) => {
        try {
            const authData = req.authData;
            const body = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const data = {
                user_id: authData.user_id,
                course_id: body.course_id,
                chapter_id: body.chapter_id,
                section_id: body.section_id
            }

            const progress = await courseProgressTable(data);

            if (progress.length > 0) {
                responseError(res, 400, [], 'data sudah tersimpan');
                return;
            }

            const add = await insertCourseProgress(data);

            responseData(res, 200, add);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]