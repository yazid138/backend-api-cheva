const cek = require("../../utils/cekTable");
const validate = require("../../middleware/validation");
const {deleteChapter} = require("../../models/course/chapter.model");
const {updateLink} = require("../../models/link.model");
const {chapterTable} = require("../../models/course/chapter.model");
const {responseMessage} = require("../../utils/responseHandler");
const {updateChapter} = require("../../models/course/chapter.model");
const {check, validationResult} = require("express-validator");
const {addLink} = require("../../utils/helper");
const {courseChapterTable} = require("../../models/course/courseChapter.model");
const {responseData, responseError} = require("../../utils/responseHandler");
const {insertChapter} = require("../../models/course/chapter.model");

exports.add = [
    validate.sectionSchema,
    check('url')
        .notEmpty().withMessage('masukkan url')
        .bail()
        .isURL().withMessage('bukan url'),
    async (req, res) => {
        try {
            const body = req.body;
            const course = await cek.course(req, res);

            const chapter = await courseChapterTable({
                course_id: course[0].id,
                course_chapter_id: req.params.id2
            })

            if (chapter.length === 0) {
                responseError(res, 400, [], 'chapter id tidak ada');
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array())
                return;
            }

            const link = await addLink(body.url);

            const data = {
                title: body.title,
                content: body.content,
                course_chapter_id: chapter[0].id,
                link_id: link.id,
            }

            const section = await insertChapter(data);

            responseData(res, 200, section);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.edit = [
    check('url')
        .optional()
        .isURL().withMessage('bukan url'),
    async (req, res) => {
        try {
            const body = req.body;

            const course = await cek.course(req, res);

            const cc = await courseChapterTable({
                course_id: course[0].id,
                course_chapter_id: req.params.id2
            })

            if (cc.length === 0) {
                responseError(res, 400, [], 'chapter id tidak ada');
                return;
            }

            const chapter = await chapterTable({
                course_chapter_id: cc[0].id,
                chapter_id: req.params.id3
            })

            if (chapter.length === 0) {
                responseError(res, 400, [], 'section id tidak ada');
                return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const data = {}
            const update = {}

            if (body.title) {
                data.title = body.title;
            }

            if (body.content) {
                data.content = body.content;
            }

            if (body.url) {
                update.link = await updateLink({
                    uri: body.url,
                    updated_at: new Date(),
                }, chapter[0].link_id);
            }

            if (Object.keys(data).length > 0) {
                update.info = await updateChapter(data, chapter[0].id);
                responseData(res, 200, update);
            } else {
                responseMessage(res, 200, 'tidak ada data yg berubah');
            }
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.delete = async (req, res) => {
    try {
        const course = await cek.course(req, res);

        const cc = await courseChapterTable({
            course_id: course[0].id,
            course_chapter_id: req.params.id2
        })

        if (cc.length === 0) {
            responseError(res, 400, [], 'chapter id tidak ada');
            return;
        }

        const chapter = await chapterTable({
            course_chapter_id: cc[0].id,
            chapter_id: req.params.id3
        })

        if (chapter.length === 0) {
            responseError(res, 400, [], 'section id tidak ada');
            return;
        }

        const del = await deleteChapter(chapter[0].id);

        responseData(res, 200, del);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}