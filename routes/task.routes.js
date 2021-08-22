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
    router.get('/', tokenHandler, roleAccess(['mentor', 'student']), getTask);
    router.get('/assignment', getAssignment);
    router.get('/student', tokenHandler, roleAccess(['mentor', 'student']), getTaskStudent);

    router.post('/create', tokenHandler, roleAccess('mentor'), infoSchema, taskSchema, imageRequired(true), createTask);
    router.put('/:id/edit', tokenHandler, roleAccess('mentor'), editTask);
    router.post('/:id/helper/add', tokenHandler, roleAccess('mentor'), taskHelperSchema, linkRequired(), addTaskHelper);

    router.get('/:id/student/', tokenHandler, roleAccess(['mentor', 'student']), getTaskStudent);
    router.get('/:id/student/:id2', tokenHandler, roleAccess('mentor'), getTaskStudent);

    router.post('/:id/assignment/add',tokenHandler, roleAccess('student'), linkRequired(), addStudentAssignment);
    router.put('/:id/assignment/edit',tokenHandler, roleAccess('student'), editAssignmentAnswer);
    router.put('/:id/assignment/score/add',tokenHandler, roleAccess('mentor'), addScoreAssignment);

    router.get('/:id/quiz', tokenHandler, roleAccess(['mentor', 'student']), getQuiz);
    router.post('/:id/quiz/create', tokenHandler, roleAccess('mentor'), quizQuestionSchema, imageRequired(false), createQuiz);
    router.delete('/:id/quiz/remove', tokenHandler, roleAccess('mentor'), deleteQuestion);
    router.put('/:id/quiz/:id2/edit', tokenHandler, roleAccess('mentor'), editQuestion);

    router.get('/:id/quiz/answer', tokenHandler, roleAccess(['mentor', 'student']), getQuizAnswer);
    router.post('/:id/quiz/:id2/answer/add', tokenHandler, roleAccess('student'), quizAnswerSchema, addAnswer);
    router.put('/:id/quiz/:id2/answer/edit', tokenHandler, roleAccess('student'), updateQuestionAnswer);

    router.post('/:id/quiz/:id2/option/create', tokenHandler, roleAccess('mentor'), quizOptionScheme, imageRequired(false), createOption);
    router.put('/:id/quiz/:id2/option/:id3/edit', tokenHandler, roleAccess('mentor'), editOption);
    router.delete('/:id/quiz/:id2/option/:id3/remove', tokenHandler, roleAccess('mentor'), deleteOption);

    router.delete('/:id', tokenHandler, roleAccess('mentor'), removeTask);
    router.get('/:id', tokenHandler, roleAccess(['mentor', 'student']), getTask)

    app.use('/api/v1/task', router);
}