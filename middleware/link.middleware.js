const {insertLink} = require("../models/link.model");
const {check, validationResult, body} = require('express-validator');
const {responseError} = require('../utils/responseHandler');

exports.linkRequired = (required = true) => {
    let validate;
    if (required) {
        validate = check('url')
            .notEmpty().withMessage('masukkan url')
            .bail()
            .isURL().withMessage('bukan url')
    } else {
        validate = check('url')
            .if(body('url').exists())
            .isURL().withMessage('bukan url')
    }
    return [validate, async (req, res, next) => {
        try {
            const body = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            if (required === false && body.url == null) {
                next();
                return;
            }

            const data = {
                uri: body.url,
                created_at: new Date(),
                updated_at: new Date(),
            }

            const link = await insertLink(data);
            if (link.id) {
                req.link = link;
                next();
                return;
            }
            responseError(res, 400, 'ada error');
        } catch (err) {
            responseError(res, 400, err.message)
        }
    }]
}