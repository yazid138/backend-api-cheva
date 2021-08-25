const {responseData, responseError} = require("../../utils/responseHandler");
const {insertChapter} = require("../../models/course/chapter.model");

exports.add = async (req, res) => {
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