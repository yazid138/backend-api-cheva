const {quizAnswerTable} = require("../models/task/quiz/quizAnswer.model");
const {quizQuestionTable} = require("../models/task/quiz/quiz.model");
const {taskStudentTable} = require("../models/task/taskStudent.model");
const {courseChapterTable} = require("../models/course/courseChapter.model");
const {presenceTable} = require("../models/studygroup/presence.model");
const {studyGroupTable} = require("../models/studygroup/studygroup.model");
const {courseTable} = require("../models/course/course.model");
const {taskTable} = require("../models/task/task.model");
const {quizOptionTable} = require("../models/task/quiz/quizOption.model");

const {roleTable} = require("../models/role.model");
const {divTable} = require("../models/div.model");
const {userTable} = require("../models/user.model");
const {check} = require('express-validator');

const checkTaskId = async (value, {req}) => {
    const authData = req.authData;
    const dataTask = await taskTable({
        task_id: value,
        mentor_id: authData.user_id
    });
    if (dataTask.length === 0) {
        throw new Error('id tidak ada');
    }
}

async function checkSg(value, {req}) {
    const sg = await studyGroupTable({
        studygroup_id: value,
        mentor_id: req.authData.user_id,
        is_active: true
    });
    if (sg.length === 0) {
        throw new Error('tidak ada sg');
    }
}

async function checkPresence(value, {req}) {
    const sg = await presenceTable({
        studygroup_id: req.body.studygroup_id,
        student_id: value
    });
    if (sg.length === 0) {
        throw new Error('tidak ada student_id');
    }
}

async function checkStudentId(value, {req}) {
    const presence = await presenceTable({student_id: value, studygroup_id: req.body.studygroup_id});
    if (presence.length !== 0) {
        throw new Error('student_id ' + value + ' sudah ada');
    }
    return true;
}

async function emptyStudent(value, {req}) {
    const authData = req.authData;
    const student = await userTable({
        div_id: authData.div_id,
        role_id: 2,
    });
    if (student.length === 0) {
        throw new Error('tidak ada siswa');
    }
    const student_id = student.map(e => e.id);
    if (!student_id.includes(value)) {
        throw new Error('id ' + value + ' tidak ada');
    }
}

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
        mentor_id: authData.user_id
    });
    if (dataTask.length === 0) {
        throw new Error('id tidak ada');
    }
    if (dataTask[0].type !== 'quiz') {
        throw new Error('type bukan quiz');
    }
}

const checkSgMentor = async (value, {req}) => {
    const cek = await studyGroupTable({
        studygroup_id: req.body.studygroup_id,
        mentor_id: value
    })
    if (cek.length === 0) {
        throw new Error('tidak ada id');
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

const checkCourseId = async (value, {req}) => {
    const authData = req.authData;
    const dataCourse = await courseTable({
        course_id: value,
        mentor_id: authData.user_id
    });
    if (dataCourse.length === 0) {
        throw new Error('id tidak ada');
    }
}

const checkCourseChapterId = async (value, {req}) => {
    const authData = req.authData;
    const dataCourse = await courseChapterTable({
        course_chapter_id: value,
        mentor_id: authData.user_id,
    });
    if (dataCourse.length === 0) {
        throw new Error('id tidak ada');
    }
}

const checkTaskStudentId = async value => {
    const ts = await taskTable({task_id: value, type: 'quiz'});
    if (ts.length === 0) throw new Error('id tidak ada');
}

const checkQuestionId = async (value, {req}) => {
    const question = await quizQuestionTable({task_id: req.body.task_id, quiz_question_id: value});
    if (question.length === 0) throw new Error('tidak ada');
}

const checkQuestionId2 = async (value, {req}) => {
    const question = await quizQuestionTable({task_id: req.body.task_id, quiz_question_id: value});
    if (question.length === 0) throw new Error('tidak ada');
    const ts = await taskStudentTable({student_id: req.authData.user_id, task_id: req.body.task_id});
    const qa = await quizAnswerTable({question_id: value, task_student_id: ts[0].id});
    if (qa.length > 0) {
        throw new Error('data sudah ada, silahkan untuk update');
    }
}

const checkOptionId = async (value, {req}) => {
    const option = await quizOptionTable({quiz_question_id: req.body.question_id, quiz_option_id: value})
    if (option.length === 0) throw new Error('tidak ada');
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
    check('task_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .custom(checkTaskStudentId)

    ,
    check('question_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .custom(checkQuestionId)
    ,
    check('value')
        .notEmpty().withMessage('harus diisi')
        .trim()
    ,
    check('is_true')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isString().withMessage('harus string')
        .bail()
        .isBoolean().withMessage('harus boolean')
        .bail()
        .custom(isTrueOne)
    ,
]

exports.glossarySchema = [
    check('course_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(checkCourseId)
    ,
]

exports.sgSchema = [
    check('time_start')
        .notEmpty().withMessage('time_start harus diisi')
        .bail()
        .matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/).withMessage('format tidak seusai')
    ,
    check('time_end')
        .notEmpty().withMessage('time_end harus diisi')
        .bail()
        .matches(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/).withMessage('format tidak seusai')
    ,
]

exports.presenceSchema = [
    check('studygroup_id')
        .notEmpty().withMessage('studygroup_id harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(checkSg)
    ,
    check('student_id')
        .notEmpty().withMessage('student_id harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(checkStudentId)
        .bail()
        .custom(emptyStudent)
    ,
    check('hadir')
        .notEmpty().withMessage('hadir harus diisi')
        .bail()
        .isBoolean().withMessage('harus boolean')
    ,
]

exports.taskHelperSchema = [
    check('title')
        .notEmpty().withMessage('harus diisi')
        .trim()
    ,
]

exports.chapterSchema = [
    check('title')
        .notEmpty().withMessage('harus diisi')
        .trim()
    ,
    check('course_id')
        .notEmpty().withMessage('haurs diisi')
        .bail()
        .isNumeric()
        .bail()
        .custom(checkCourseId)
    ,
]
exports.sectionSchema = [
    check('title')
        .notEmpty().withMessage('harus diisi')
        .trim()
    ,
    check('chapter_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric()
        .bail()
        .custom(checkCourseChapterId)
    ,
    check('content')
        .optional()
        .isString()
        .trim()
    ,
]

exports.updatePresenceSchema = [
    check('student_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric()
        .custom(checkPresence)
    ,
    check('hadir')
        .notEmpty().withMessage('hadir harus diisi')
        .bail()
        .isBoolean().withMessage('harus boolean')
    ,
]

exports.studygroupUpdateShcema = [
    check('studygroup_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(checkSg)
]

exports.quizAnswerSchema = [
    check('task_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(checkTaskStudentId)
    ,
    check('option_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(checkOptionId)
    ,
    check('question_id')
        .notEmpty().withMessage('harus diisi')
        .bail()
        .isNumeric().withMessage('harus angka')
        .bail()
        .custom(checkQuestionId2)
]