const fs = require("fs");
const {updateMedia} = require("../models/media.model");
const {insertLink} = require("../models/link.model");
const {insertMedia} = require("../models/media.model");
const {responseMessage} = require("./responseHandler");
const {uploadValidation} = require("./fileUpload");

exports.editMedia = async (res, id, value) => {
    if (fs.existsSync('./public/' + value.path)) {
        fs.unlinkSync('./public/' + value.path)
    }

    const fileValidation = uploadValidation(value.file);
    if (!fileValidation.success) {
        responseMessage(res, 400, fileValidation.result);
        return;
    }

    const filePath = `images/${fileValidation.result}`;
    const fileName = `${__dirname}/../public/`;

    await value.file.mv(`${fileName}${filePath}`, err => {
        if (err)
            responseMessage(res, 400, err.message);
    })

    let data = {
        uri: `/${filePath}`,
        updated_at: new Date()
    }

    if (value.label != null) {
        data.label = value.label;
    }

    return await updateMedia(data, id);
}

exports.addMedia = async (res, {file, label}) => {
    const fileValidation = uploadValidation(file);
    if (!fileValidation.success) {
        responseMessage(res, 400, fileValidation.result);
        return;
    }

    const filePath = `images/${fileValidation.result}`;
    const fileName = `${__dirname}/../public/`;

    await file.mv(`${fileName}${filePath}`, err => {
        if (err)
            responseMessage(res, 400, err.message);
    });

    let data = {
        label: label,
        uri: `/${filePath}`,
        created_at: new Date(),
        updated_at: new Date()
    }

    return await insertMedia(data);
}

exports.addLink = async (link) => {
    const data = {
        uri: link,
        created_at: new Date(),
        updated_at: new Date(),
    }

    return await insertLink(data);
}