const router = require('express').Router();

const {getQuiz} = require("../controllers/task/quiz.controller");
const {getTaskStudent} = require("../controllers/task/taskStudent.controller");
const {getTask} = require("../controllers/task/task.controller");

module.exports = app => {
    router.get('/', getTask);

    router.get('/quiz', getQuiz);

    router.get('/student', getTaskStudent);

    app.use('/api/v1/task', router);
}