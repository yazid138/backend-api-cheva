const {insertMedia} = require("../models/media.model");
const {check, validationResult} = require('express-validator');

const {uploadValidation} = require('../utils/fileUpload');
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

        if (!file || !file.media) {
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

        await file.media.mv(`${fileName}${filePath}`, err => {
            if (err) {
                responseMessage(res, 400, err.message);
            }
        });

        const data = {
            label: body.media_label,
            uri: `/${filePath}`,
            created_at: new Date(),
            updated_at: new Date()
        }

        req.media = await insertMedia(data);
        next();
    }]
}
