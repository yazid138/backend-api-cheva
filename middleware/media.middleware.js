const {insertMedia} = require("../models/media.model");
const {check, validationResult} = require('express-validator');

const {uploadValidation} = require('../utils/fileUpload');
const {addFile} = require('../models/media.model');
const {responseData, responseMessage, responseError} = require('../utils/responseHandler');

const mediaLabel = (value, {req}) => {
    const file = req.files;
    if (file == null || !file.media && value !== null) {
        throw new Error('media_label harus diisi');
    }
    return true;
}

exports.imageRequired = (required = true) => {
    let validate = [check('media_label')
        .if(mediaLabel)
        .notEmpty().withMessage('media_label harus diisi')
        .bail()
        .matches(/[\w]/).withMessage('media_label harus huruf dan angka')
        .trim().escape()];

    return [validate, async (req, res, next) => {
        const baseURL = process.env.BASE_URL;
        const body = req.body;
        const file = req.files;

        if (file == null || !file.media) {
            if (required) {
                responseMessage(res, 400, 'media harus di upload');
                return;
            } else {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    responseError(res, 400, errors.array());
                    return;
                }
                next();
            }
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            responseError(res, 400, errors.array());
            return;
        }

        const fileValidation = uploadValidation(file.media);
        if (!fileValidation.success) {
            responseMessage(res, 400, fileValidation.result);
            return;
        }

        const filePath = `images/${fileValidation.result}`;
        const fileName = `${__dirname}/../public/`;

        const data = {
            label: body.media_label,
            uri: `${baseURL}/${filePath}`,
            created_at: new Date(),
            updated_at: new Date()
        }

        await file.media.mv(`${fileName}${filePath}`, err => {
            if (err) {
                responseMessage(res, 400, err.message);
            }
        });

        req.media = await insertMedia(data);
        next();
    }]
}
