const {taskStudentTable} = require("../models/task/taskStudent.model");
const {userTable} = require("../models/user.model");
const {courseTable} = require("../models/course/course.model");
const {studyGroupTable} = require("../models/studygroup/studygroup.model");
const {taskTable} = require("../models/task/task.model");
const {taskHelperTable} = require("../models/task/taskHelper.model");
const {responseError} = require("./responseHandler");

exports.task = async (req, res) => {
    const authData = req.authData;

    const task = await taskTable({
        task_id: req.params.id,
        mentor_id: authData.user_id,
    })

    if (task.length === 0) {
        responseError(res, 400, [], 'task id tidak ada');
        return;
    }
    return task;
}

exports.taskStudent = async (req, res, params) => {
    const authData = req.authData;
    const ts = await taskStudentTable({
        task_id: params.task_id,
        student_id: authData.user_id
    });

    if (ts.length === 0) {
        responseError(res, 400, 'tidak ada data');
        return;
    }

    return ts;
}

exports.taskHelper = async (req, res, params = {}) => {
    const parameter = {
        task_helper_id: req.params.id2
    }

    if (params.task_id) {
        parameter.task_id = params.task_id;
    }

    const taskHelper = await taskHelperTable(parameter)

    if (taskHelper.length === 0) {
        responseError(res, 400, [], 'task helper id tidak ada');
        return;
    }

    return taskHelper;
}

exports.studygroup = async (req, res) => {
    const authData = req.authData;

    const sg = await studyGroupTable({
        studygroup_id: req.params.id,
        mentor_id: authData.user_id
    })

    if (sg.length === 0) {
        responseError(res, 400, [], 'studygroup id tidak ada');
        return;
    }
    return sg;
}

exports.course = async (req, res) => {
    const authData = req.authData;

    const course = await courseTable({
        course_id: req.params.id,
        mentor_id: authData.user_id
    })

    if (course.length === 0) {
        responseError(res, 400, [], 'course id tidak ada');
        return;
    }
    return course;
}

exports.user = async (req, res) => {
    const authData = req.authData;

    const user = await userTable({
        user_id: authData.user_id
    })

    if (user.length === 0) {
        responseError(res, 400, [], 'tidak ada user');
        return;
    }
    return user;
}