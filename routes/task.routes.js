const {checkUser} = require("../middleware/user.middleware");
const {linkRequired} = require("../middleware/link.middleware");
const {imageRequired} = require("../middleware/media.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");
const {
    getTaskStudent,
    addScoreAssignment
} = require("../controllers/task/taskStudent.controller");
const {
    getAssignment,
    addStudentAssignment,
    editAssignmentAnswer
} = require("../controllers/task/assignment.controller");
const {
    getQuiz,
    createQuiz,
    createOption,
    deleteQuestion,
    deleteOption,
    editQuestion,
    editOption,
    updateQuestionAnswer,
    addAnswer,
    getQuizAnswer
} = require("../controllers/task/quiz.controller");
const {
    getTask,
    createTask,
    editTask,
    removeTask,
    addTaskHelper
} = require("../controllers/task/task.controller");
const {
    infoSchema,
    taskSchema,
    quizOptionScheme,
    quizQuestionSchema,
    taskHelperSchema,
    quizAnswerSchema
} = require("../middleware/validation");
const router = require('express').Router();

module.exports = app => {
    router.get('/', tokenHandler, checkUser, roleAccess(['mentor', 'student']), getTask);
    router.get('/assignment', tokenHandler, checkUser, getAssignment);
    router.get('/student', tokenHandler, checkUser, roleAccess(['mentor', 'student']), getTaskStudent);

    router.post('/create', tokenHandler, checkUser, roleAccess('mentor'), infoSchema, taskSchema, imageRequired(true), createTask);
    router.put('/:id/edit', tokenHandler, checkUser, roleAccess('mentor'), editTask);
    router.post('/:id/helper/add', tokenHandler, checkUser, roleAccess('mentor'), taskHelperSchema, linkRequired(), addTaskHelper);

    router.get('/:id/student/', tokenHandler, checkUser, roleAccess(['mentor', 'student']), getTaskStudent);
    router.get('/:id/student/:id2', tokenHandler, checkUser, roleAccess('mentor'), getTaskStudent);

    router.post('/:id/assignment/add',tokenHandler, checkUser, roleAccess('student'), linkRequired(), addStudentAssignment);
    router.put('/:id/assignment/edit',tokenHandler, checkUser, roleAccess('student'), editAssignmentAnswer);
    router.put('/:id/assignment/score/add',tokenHandler, checkUser, roleAccess('mentor'), addScoreAssignment);

    router.get('/:id/quiz', tokenHandler, checkUser, roleAccess(['mentor', 'student']), getQuiz);
    router.post('/:id/quiz/create', tokenHandler, checkUser, roleAccess('mentor'), quizQuestionSchema, imageRequired(false), createQuiz);
    router.delete('/:id/quiz/remove', tokenHandler, checkUser, roleAccess('mentor'), deleteQuestion);
    router.put('/:id/quiz/:id2/edit', tokenHandler, checkUser, roleAccess('mentor'), editQuestion);

    router.get('/:id/quiz/answer', tokenHandler, checkUser, roleAccess(['mentor', 'student']), getQuizAnswer);
    router.post('/:id/quiz/:id2/answer/add', tokenHandler, checkUser, roleAccess('student'), quizAnswerSchema, addAnswer);
    router.put('/:id/quiz/:id2/answer/edit', tokenHandler, checkUser, roleAccess('student'), updateQuestionAnswer);

    router.post('/:id/quiz/:id2/option/create', tokenHandler, checkUser, roleAccess('mentor'), quizOptionScheme, imageRequired(false), createOption);
    router.put('/:id/quiz/:id2/option/:id3/edit', tokenHandler, checkUser, roleAccess('mentor'), editOption);
    router.delete('/:id/quiz/:id2/option/:id3/remove', tokenHandler, checkUser, roleAccess('mentor'), deleteOption);

    router.get('/:id', tokenHandler, checkUser, roleAccess(['mentor', 'student']), getTask)
    router.delete('/:id', tokenHandler, checkUser, roleAccess('mentor'), removeTask);

    app.use('/api/v1/task', router);
}