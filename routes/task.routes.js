const {checkUser} = require("../middleware/user.middleware");
const {linkRequired} = require("../middleware/link.middleware");
const {imageRequired} = require("../middleware/media.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");
const ts = require("../controllers/task/taskStudent.controller");
const assignment = require("../controllers/task/assignment.controller");
const quiz = require("../controllers/task/quiz/quiz.controller");
const answer = require("../controllers/task/quiz/quiz_answer.controller");
const option = require("../controllers/task/quiz/quiz_option.controller");
const task = require("../controllers/task/task.controller");
const taskHelper = require("../controllers/task/taskHelper.controller");
const {
    quizOptionScheme,
    quizQuestionSchema,
    quizAnswerSchema
} = require("../middleware/validation");
const router = require('express').Router();

module.exports = app => {
    router.get('/', roleAccess(['mentor', 'student']), task.list);
    router.get('/assignment', roleAccess(['mentor', 'student']), assignment.list);
    router.get('/student', roleAccess(['mentor', 'student']), ts.list);

    router.post('/create', roleAccess('mentor'), task.create);
    router.put('/:id/edit', roleAccess('mentor'), task.edit);

    router.put('/:id/thumbnail/edit', roleAccess('mentor'), task.editMedia);

    router.post('/:id/helper/add', roleAccess('mentor'), taskHelper.add);
    router.put('/:id/helper/:id2/edit', roleAccess('mentor'), taskHelper.edit);
    router.delete('/:id/helper/:id2/delete', roleAccess('mentor'), taskHelper.delete);

    router.get('/:id/student/', roleAccess(['mentor', 'student']), ts.list);
    router.get('/:id/student/:id2', roleAccess('mentor'), ts.list);
    router.put('/:id/student/:id2/score/add', roleAccess('mentor'), ts.addScore);

    /*
    * Todo
    * besok lanjutin assignment
    * */
    router.get('/:id/assignment', roleAccess(['mentor', 'student']), assignment.list);
    router.post('/:id/assignment/add', roleAccess('student'), assignment.add);
    router.put('/:id/assignment/edit', roleAccess('student'), assignment.edit);

    router.get('/:id/quiz', roleAccess(['mentor', 'student']), quiz.list);
    router.post('/:id/quiz/create', roleAccess('mentor'), quizQuestionSchema, imageRequired(false), quiz.create);
    router.delete('/:id/quiz/remove', roleAccess('mentor'), quiz.delete);
    router.put('/:id/quiz/:id2/edit', roleAccess('mentor'), quiz.edit);

    router.get('/:id/quiz/answer', roleAccess(['mentor', 'student']), answer.list);
    router.post('/:id/quiz/:id2/answer/add', roleAccess('student'), quizAnswerSchema, answer.add);
    router.put('/:id/quiz/:id2/answer/edit', roleAccess('student'), answer.edit);

    router.post('/:id/quiz/:id2/option/create', roleAccess('mentor'), quizOptionScheme, imageRequired(false), option.create);
    router.put('/:id/quiz/:id2/option/:id3/edit', roleAccess('mentor'), option.edit);
    router.delete('/:id/quiz/:id2/option/:id3/remove', roleAccess('mentor'), option.delete);

    router.get('/:id', roleAccess(['mentor', 'student']), task.list)
    router.delete('/:id', roleAccess('mentor'), task.remove);

    app.use('/api/v1/task', tokenHandler, checkUser, router);
}