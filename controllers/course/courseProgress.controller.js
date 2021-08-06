const {courseTable} = require("../../models/course/course.model");
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

        const course = await courseTable(params);

        if (course.length === 0) {
            responseError(res, 400, [], 'tidak ada data');
        }

        const data = await Promise.all(course.map(async e => {
            const data = {
                course_id: e.id,
            }
            const cp = await courseProgressTable({course_id: e.id, max: true});
            data.reader = await Promise.all(cp.map(async e => {
                const data = {
                    user: {
                        name: e.user_name,
                        div: e.div_name,
                    },
                    progress: {
                        id: e.id,
                        last_read: {
                            course_id: e.course_id,
                            chapter_id: e.chapter_id,
                            section_id: e.section_id,
                        }
                    },
                }
                const progress = await courseProgressTable({select: '(COUNT(cp.chapter_id)/COUNT(chapter.id))* 100 progress'})
                data.total = progress[0].total_reader;
                data.progress.percent = progress[0].progress;
                return data;
            }))
            return data;
        }))

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}