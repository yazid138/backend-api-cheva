const hash = require("password-hash");
const {editMedia} = require("../utils/helper");
const {userTable, updateUser} = require("../models/user.model");
const {updateProfile, profileTable} = require("../models/profile.model");
const {responseData, responseError} = require("../utils/responseHandler");
const {check, validationResult} = require("express-validator");

exports.detail = async (req, res) => {
    try {
        const authData = req.authData;

        let profile = await profileTable({
            user_id: authData.user_id
        })
        profile = profile[0];

        const data = {
            name: profile.name,
            div: profile.div_name,
            role: profile.role_name,
            media: null,
            created_at: profile.created_at,
            updated_at: profile.updated_at
        }

        if (profile.uri) {
            data.media = {
                label: profile.label,
                uri: profile.uri
            }
        }

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err);
    }
}

exports.edit = [
    check('name')
        .optional()
        .isString()
        .isLength({min: 3}).withMessage('minimal 3 huruf')
        .trim()
    ,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array())
                return;
            }

            const authData = req.authData;
            const body = req.body;
            let profile = await profileTable({
                user_id: authData.user_id
            })
            profile = profile[0];

            const data = {
                updated_at: new Date()
            }

            if (body.name) {
                data.name = body.name;
            }

            const update = await updateProfile(data, profile.id);

            responseData(res, 200, update);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.editPassword = [
    check('old_password')
        .notEmpty().withMessage('harus diisi'),
    check('new_password')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isLength({min: 3}).withMessage('harus 3 karakter'),
        // .bail()
        // .matches('[0-9]').withMessage('Password harus terdapat Angka')
        // .matches('[A-Z]').withMessage('Password harus terdapat Huruf Besar')
        // .matches('[^\\w\\s]').withMessage('Password harus terdapat Symbol'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array())
                return;
            }

            const body = req.body;
            const authData = req.authData;

            let user = await userTable({user_id: authData.user_id});
            user = user[0];

            if (!hash.verify(body.old_password, user.password)) {
                responseError(res, 401, [], 'old password salah');
                return;
            }

            const update = await updateUser({
                password: hash.generate(body.new_password, {algorithm: 'sha256'}),
            }, user.id);
            responseData(res, 200, update);
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]

exports.editMedia = async (req, res) => {
    try {
        const file = req.files;
        const authData = req.authData;

        let profile = await profileTable({
            user_id: authData.user_id
        })
        profile = profile[0];

        if (!file || !file.media) {
            responseError(res, 400, [], 'file media harus di upload');
            return;
        }

        const update = await editMedia(res, profile.media_id, {
            file: file.media,
            path: profile.uri
        })

        responseData(res, 200, update);
    } catch (err) {
        responseError(res, 400, err);
    }
}