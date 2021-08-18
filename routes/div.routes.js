const router = require('express').Router();

const {
    getDiv,
    deleteDiv,
    createDiv
} = require("../controllers/div.controller");

module.exports = (app) => {
    router.get('/', getDiv);
    router.post('/add', createDiv);
    router.delete('/delete', deleteDiv);

    app.use('/api/v1/div', router);
}