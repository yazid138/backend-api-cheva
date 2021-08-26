const fs = require("fs");
const {mediaTable} = require("../models/media.model");
const {deleteMedia} = require("../models/media.model");
const {insertLink} = require("../models/link.model");
const {insertMedia, updateMedia} = require("../models/media.model");
const {responseMessage} = require("./responseHandler");
const {uploadValidation} = require("./fileUpload");

exports.deleteMedia = async (media_id) => {
    const media = await mediaTable({
        media_id: media_id
    })

    fs.exists('./public/' + media[0].uri, () => {
        fs.unlinkSync('./public/' + media[0].uri)
    });

    return await deleteMedia(media[0].id);
}

exports.editMedia = async (res, id, value) => {
    fs.exists('./public/' + value.path, () => {
        fs.unlinkSync('./public/' + value.path)
    });

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

exports.addMedia = async (res, value) => {
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
    });

    let data = {
        label: value.label,
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