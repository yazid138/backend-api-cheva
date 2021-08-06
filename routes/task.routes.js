const {addTaskHelper} = require("../controllers/task/task.controller");
const {linkRequired} = require("../middleware/link.middleware");
const {getTaskStudent} = require("../controllers/task/taskStudent.controller");
const {imageRequired} = require("../middleware/media.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");

const {
    getQuiz,
    createQuiz,
    createOption
} = require("../controllers/task/quiz.controller");

const {
    getTask,
    createTask
} = require("../controllers/task/task.controller");

const {
    infoSchema,
    taskSchema,
    quizOptionScheme,
    quizQuestionSchema,
    taskHelperSchema
} = require("../middleware/validation");

const router = require('express').Router();

module.exports = app => {
    router.get('/', getTask);
    router.post('/create', tokenHandler, roleAccess('mentor'), infoSchema, taskSchema, imageRequired(true), createTask);
    router.post('/helper/add', tokenHandler, roleAccess('mentor'), taskHelperSchema, linkRequired(), addTaskHelper);

    router.get('/quiz', getQuiz);
    router.post('/quiz/create', tokenHandler, roleAccess('mentor'), quizQuestionSchema, imageRequired(false), createQuiz);
    router.post('/quiz/option/create', tokenHandler, roleAccess('mentor'), quizOptionScheme, imageRequired(false), createOption);

    router.get('/student', getTaskStudent);

    app.use('/api/v1/task', router);
}