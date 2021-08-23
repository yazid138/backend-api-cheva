const {userTable} = require("../models/user.model");
const checkUser = async id => {
    const user = await userTable({
        user_id: id
    })
    return user.length !== 0;
}