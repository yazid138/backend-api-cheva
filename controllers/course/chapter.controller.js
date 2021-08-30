const cek = require("../../utils/cekTable");
const {deleteCourseChapter} = require("../../models/course/courseChapter.model");
const {responseMessage} = require("../../utils/responseHandler");
const {updateCourseChapter} = require("../../models/course/courseChapter.model");
const {courseChapterTable} = require("../../models/course/courseChapter.model");
const {insertCourseChapter} = require("../../models/course/courseChapter.model");
const {responseData, responseError} = require("../../utils/responseHandler");
const {check, validationResult} = require("express-validator");

exports.create = [
    check('title')
        .notEmpty().withMessage('harus diisi')
        .trim()
    ,
    async (req, res) => {
        try {
            const body = req.body;

            const course = await cek.course(req, res);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const data = {
                title: body.title,
                course_id: course[0].id,
            }

            const cc = await insertCourseChapter(data);
            responseData(res, 200, cc);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.edit = async (req, res) => {
    try {
        const body = req.body;

        const course = await cek.course(req, res);

        const chapter = await courseChapterTable({
            course_chapter_id: req.params.id2,
            course_id: course[0].id
        })

        if (chapter.length === 0) {
            responseError(res, 400, [], 'chapter id tidak ada');
            return;
        }

        const data = {}

        if (body.title) {
            data.title = body.title;
        }

        if (Object.keys(data).length > 0) {
            const update = await updateCourseChapter(data, chapter[0].id);
            responseData(res, 200, update);
        } else {
            responseMessage(res, 200, 'tidak ada data yg berubah');
        }
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.delete = async (req, res) => {
    try {
        const course = await cek.course(req, res);

        const chapter = await courseChapterTable({
            course_chapter_id: req.params.id2,
            course_id: course[0].id
        })

        if (chapter.length === 0) {
            responseError(res, 400, [], 'chapter id tidak ada');
            return;
        }

        const del = await deleteCourseChapter(chapter[0].id);

        responseData(res, 200, del);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}