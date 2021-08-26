const {updateLink} = require("../../models/link.model");
const {updateTask} = require("../../models/task/task.model");
const {addLink} = require("../../utils/helper");
const {deleteTaskHelper, insertTaskHelper} = require("../../models/task/taskHelper.model");
const {responseData, responseError} = require("../../utils/responseHandler");
const {check, validationResult} = require("express-validator");
const cek = require('../../utils/cekTable');
const validate = require("../../middleware/validation");

exports.add = [
    validate.taskHelperSchema,
    check('url')
        .notEmpty().withMessage('masukkan url')
        .bail()
        .isURL().withMessage('bukan url'),
    async (req, res) => {
        try {
            const body = req.body;

            const task = await cek.task(req, res);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const link = await addLink(body.url);

            const data = {
                task_id: task[0].id,
                title: body.title,
                link_id: link.id,
            }

            const taskHelper = await insertTaskHelper(data);
            responseData(res, 200, taskHelper);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.edit = [
    check('title')
        .optional()
        .isString(),
    check('url')
        .optional()
        .isURL().withMessage('bukan url'),
    async (req, res) => {
        try {
            const body = req.body;

            const task = await cek.task(req, res);
            const taskHelper = await cek.taskHelper(req, res, {task_id:task[0].id});

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const data = {}
            const cekData = {}

            if (body.title) {
                data.title = body.title;
                cekData.title = await updateTask(data, task[0].id);
            }

            if (body.url) {
                cekData.link = await updateLink({
                    uri: body.url,
                    updated_at: new Date(),
                }, taskHelper[0].link_id);
            }

            responseData(res, 200, cekData);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]

exports.delete = async (req, res) => {
    try {
        const task = await cek.task(req, res);
        const taskHelper = await cek.taskHelper(req, res, {task_id:task[0].id});

        const remove = await deleteTaskHelper(taskHelper[0].id);
        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err.message);
    }
}
