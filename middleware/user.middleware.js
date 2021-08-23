const {responseError} = require("../utils/responseHandler");
const {userTable} = require("../models/user.model");

exports.checkUser = async (req, res, next) => {
    const authData = req.authData;
    const user = await userTable({
        user_id: authData.user_id
    })

    if (user.length === 0) {
        responseError(res, 400, [], 'tidak ada user');
    }
    next();
}