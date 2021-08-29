const cek = require("../../utils/cekTable");
const validate = require("../../middleware/validation");
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