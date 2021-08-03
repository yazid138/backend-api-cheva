const {taskTable} = require("../models/task/task.model");
const {quizOptionTable} = require("../models/task/quiz/quizOption.model");
const {check} = require('express-validator');

const {roleTable} = require("../models/role.model");
const {divTable} = require("../models/div.model");
const {userTable} = require("../models/user.model");

const emptyUser = async value => {
    const user = await userTable({username: value});
    if (user.length === 0)
        throw new Error('username tidak ada');
}

const emptyDivision = async value => {
    const div = await divTable({div_id: value});
    if (div.length === 0)
        throw new Error('div_id tidak ada');
}

const emptyRole = async value => {
    const role = await roleTable({role_id: value});
    if (role.length === 0)
        throw new Error('role_id tidak ada');
}

const validDate = value => {
    const date = (new Date(value)).getTime();
    if (date > 0)
        throw new Error('date valid');
    return true;
}

const checkQuizTask = async (value, {req}) => {
    const authData = req.authData;
    const dataTask = await taskTable({
        task_id: value,
        mentor_id: authData.user_id});
    if (dataTask.length === 0) {
        throw new Error('id tidak ada');
    }
    if (dataTask[0].type !== 'quiz') {
        throw new Error('type bukan quiz');
    }
}

const isTrueOne = async (value, {req}) => {
    const question_id = req.body.question_id;
    const options = await quizOptionTable({quiz_question_id: question_id});
    const isTrue = options.map(e => Boolean(e.is_true));
    if (isTrue.includes(value === "true") && value === "true") {
        throw new Error("jawaban benar sudah di set, harap update untuk merubah");
    }
}


exports.loginSchema = [
    check('username')
        .notEmpty().withMessage('username harus diisi')
    ,
    check('password')
        .notEmpty().withMessage('password harus diisi')
    ,
]

exports.userSchema = [
    check('username')
        .notEmpty().withMessage('username harus diisi')
        .bail()
        .isAlphanumeric().withMessage('huruf dan angka')
        .bail()
        .not().custom(emptyUser).withMessage('username sudah ada')
    ,
    check('password')
        .isLength({min: 3}).withMessage('harus 3 karakter')
    // .bail()
    // .matches('[0-9]').withMessage('Password harus terdapat Angka')
    // .matches('[A-Z]').withMessage('Password harus terdapat Huruf Besar')
    // .matches('[^\\w\\s]').withMessage('Password harus terdapat Symbol')
    ,
]

exports.profileSchema = [
    check('name')
        .notEmpty().withMessage('name harus diisi')
        .bail()
        .matches(/^[a-zA-Z ]*$/).withMessage('name harus huruf dan angka')
        .trim()
    ,
    check('div_id')
        .notEmpty().withMessage('div_id harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(emptyDivision)
    ,
    check('role_id')
        .notEmpty().withMessage('role_id harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(emptyRole)
    ,
]

exports.infoSchema = [
    check('title')
        .notEmpty().withMessage('title harus diisi')
        .trim()
    ,
    check('description')
        .notEmpty().withMessage('description harus diisi')
        .trim()
    ,
]

exports.taskSchema = [
    check('type')
        .notEmpty().withMessage('type harus diisi')
        .bail()
        .isIn(['quiz', 'assignment']).withMessage('harus quiz,assignment')
        .trim()
    ,
    check('deadline')
        .notEmpty().withMessage('deadline harus diisi')
        .bail()
        .not()
        .custom(validDate)
        .withMessage('format timestamp tidak benar')
]

exports.quizQuestionSchema = [
    check('task_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .custom(checkQuizTask)
    ,
    check('question')
        .notEmpty().withMessage('harus diisi')
        .trim()
]

exports.quizOptionScheme = [
    check('question_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
    ,
    check('value')
        .notEmpty().withMessage('harus diisi')
        .trim()
    ,
    check('is_true')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isBoolean().withMessage('harus boolean')
        .bail()
        .custom(isTrueOne)
    ,
]