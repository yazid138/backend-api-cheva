const {courseProgressTable} = require("../../models/course/courseProgress.model");
const {
    responseError,
    responseData
} = require("../../utils/responseHandler");

exports.getCourseProgress = async (req, res) => {
    try {
        const query = req.query;
        const params = {};

        if (query.course_id) {
            params.course_id = query.course_id;
        }

        const cp = await courseProgressTable(params);

        if (cp.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
        }

        const data = cp.map(e => {
            return {
                course_progress_id: e.id,
                course_id: e.course_id,
                chapter_id: e.chapter_id,
                user: {
                    id: e.user_id,
                    name: e.user_name,
                    div: {
                        id: e.div_id,
                        name: e.div_name,
                    },
                },
                progress: e.progress,
            }
        })

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}