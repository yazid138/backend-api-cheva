const {checkUser} = require("../middleware/user.middleware");
const {roleAccess} = require("../middleware/roleValidation");
const {tokenHandler} = require("../middleware/tokenValidation");
const ts = require("../controllers/task/taskStudent.controller");
const assignment = require("../controllers/task/assignment.controller");
const quiz = require("../controllers/task/quiz/quiz.controller");
const answer = require("../controllers/task/quiz/quiz_answer.controller");
const option = require("../controllers/task/quiz/quiz_option.controller");
const task = require("../controllers/task/task.controller");
const taskHelper = require("../controllers/task/taskHelper.controller");

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

    router.get('/:id/assignment', roleAccess(['mentor', 'student']), assignment.list);
    router.post('/:id/assignment/add', roleAccess('student'), assignment.add);
    router.put('/:id/assignment/edit', roleAccess('student'), assignment.edit);
    router.delete('/:id/assignment/remove', roleAccess('student'), assignment.remove);
    router.post('/:id/assignment/score/add', roleAccess('mentor'), assignment.addScore);
    router.put('/:id/assignment/score/edit', roleAccess('mentor'), assignment.editScore);

    router.get('/:id/quiz', roleAccess(['mentor', 'student']), quiz.list);
    router.post('/:id/question/create', roleAccess('mentor'), quiz.create);
    router.get('/:id/question/:id2', roleAccess(['mentor', 'student']), quiz.list);
    router.put('/:id/question/:id2/edit', roleAccess('mentor'), quiz.edit);
    router.delete('/:id/question/:id2/remove', roleAccess('mentor'), quiz.delete);

    router.post('/:id/question/:id2/media/add', roleAccess('mentor'), quiz.addMedia);
    router.delete('/:id/question/:id2/media/remove', roleAccess('mentor'), quiz.removeMedia);

    router.get('/:id/quiz/answer', roleAccess(['mentor', 'student']), answer.list);
    router.post('/:id/question/:id2/answer/add', roleAccess('student'), answer.add);
    router.put('/:id/question/:id2/answer/edit', roleAccess('student'), answer.edit);

    router.post('/:id/question/:id2/option/create', roleAccess('mentor'), option.create);
    router.put('/:id/question/:id2/option/:id3/edit', roleAccess('mentor'), option.edit);
    router.delete('/:id/question/:id2/option/:id3/remove', roleAccess('mentor'), option.delete);

    router.post('/:id/question/:id2/option/:id3/media/add', roleAccess('mentor'), option.addMedia);
    router.delete('/:id/question/:id2/option/:id3/media/remove', roleAccess('mentor'), option.removeMedia);

    router.get('/:id', roleAccess(['mentor', 'student']), task.list)
    router.delete('/:id/delete', roleAccess('mentor'), task.remove);

    app.use('/api/v1/task', tokenHandler, checkUser, router);
}