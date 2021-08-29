const path = require('path');

exports.uploadValidation = image => {
    const fileType = /jpeg|jpg|png/
    const mimeType = fileType.test(image.mimeType);
    const extName = fileType.test(path.extname(image.name).toLowerCase());
    const size = 5;

    if (!mimeType && !extName) return {
        success: false,
        result: 'File is not an image'
    }

    if (image.size > size * 1024 * 1024) return {
        success: false,
        result: `File is to large, max. ${size} mb`
    }

    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const newFileName = `${uniquePrefix}-${image.name.replace(/ /g, "-")}`;

    return {
        success: true,
        result: newFileName
    }
}