const hash = require('password-hash');
const validate = require("../middleware/validation");
const jwt = require('jsonwebtoken');
const {check, validationResult} = require("express-validator");
const {addMedia} = require("../utils/helper");
const {mediaTable} = require("../models/media.model");
const {insertProfile} = require('../models/profile.model');
const {insertUser, userTable} = require("../models/user.model");
const {responseError, responseData} = require("../utils/responseHandler");

exports.login = [
    validate.loginSchema,
    async (req, res) => {
        try {
            const body = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 401, errors.array());
            }

            let user = await userTable({username: body.username});
            if (user.length === 0) {
                responseError(res, 400, [], 'user tidak ada');
            }
            user = user[0];

            if (!hash.verify(body.password, user.password)) {
                responseError(res, 401, [], 'password salah');
            }

            let media = user.media_id;
            if (media) {
                media = await mediaTable({media_id: user.media_id});
                media = media[0];
                media = {
                    id: media.id,
                    label: media.label,
                    uri: media.uri,
                }
            }

            jwt.sign({
                user_id: user.id,
                div_id: user.div_id,
                role_id: user.role_id,
            }, 'rahasia', {
                expiresIn: '1d'
            }, (err, token) => {
                responseData(res, 200, {
                    name: user.user_name,
                    role_id: user.role_id,
                    div_id: user.div_id,
                    media,
                    token,
                })
            })
        } catch (err) {
            responseError(res, 400, err);
        }
    }
]


exports.register = [
    validate.userSchema,
    validate.profileSchema,
    check('media_label')
        .if((value, {req}) => {
            const file = req.files;
            if (file == null || !file.media && value !== null) {
                throw new Error('media_label harus diisi');
            }
            return true;
        })
        .notEmpty().withMessage('media_label harus diisi')
        .bail()
        .matches(/[\w]/).withMessage('media_label harus huruf dan angka')
        .trim().escape(),
    async (req, res) => {
        try {
            const body = req.body;
            const file = req.files;
            let media = {};
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                responseError(res, 400, errors.array());
                return;
            }

            let data = {
                username: body.username,
                password: hash.generate(body.password, {algorithm: 'sha256'}),
            }

            if (file && file.media) {
                media = await addMedia(res, {
                    file: file.media,
                    label: body.media_label
                });
            }

            const dataUser = await insertUser(data);
            const user_id = dataUser.id;

            data = {
                id: user_id,
                name: body.name,
                div_id: body.div_id,
                role_id: body.role_id,
                media_id: media != null ? media.id : media,
                created_at: new Date(),
                updated_at: new Date(),
            }
            await insertProfile(data)

            responseData(res, 200, dataUser);
        } catch (err) {
            responseError(res, 400, err.message);
        }
    }
]