const {check, validationResult} = require("express-validator");
const {deleteDiv} = require("../models/div.model");
const {insertDiv} = require("../models/div.model");
const {divTable} = require("../models/div.model");
const {
    responseError,
    responseData
} = require("../utils/responseHandler");

exports.getDiv = async (req, res) => {
    try {
        const query = req.query;

        const params = {};
        if (query.div_id) {
            params.div_id = query.div_id;
        }
        if (query.div_name) {
            params.div_name = query.div_name;
        }

        const div = await divTable(params);
        if (div.length === 0) {
            responseError(res, 400, [], 'tidak ada');
            return;
        }

        const data = div.map(e => {
            return {
                div_id: e.id,
                div_name: e.name,
            };
        })

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err)
    }
}

exports.createDiv = [
    check('div_name')
        .notEmpty().withMessage('harus ada')
    , async (req, res) => {
        try {
            const body = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            const data = {
                name: body.div_name
            };

            const add = await insertDiv(data);
            responseData(res, 200, add);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.deleteDiv = async (req, res) => {
    try {
        const body = req.body;

        if (!body.div_id) {
            responseError(res, 400, 'tidak ada');
            return;
        }

        const remove = await deleteDiv(body.div_id);

        responseData(res, 200, remove);
    } catch (err) {
        responseError(res, 400, err);
    }
}