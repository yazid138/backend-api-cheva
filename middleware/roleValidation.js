const {roleTable} = require("../models/role.model");
const {responseError} = require('../utils/responseHandler');

exports.roleAccess = role => {
    return async (req, res, next) => {
        const user_role_id = req.authData.role_id;
        const role_name = await roleTable({role_id: user_role_id});

        if (typeof role === 'object') {
            for (const e of role) {
                const role_id = await roleTable({role_name: e});
                if (role_id.length === 0) {
                    responseError(res, 403, 'role not found');
                    return
                }
            }
            if (!role.includes(role_name[0].name)) {
                responseError(res, 403, 'access denied');
                return
            }
        } else {
            const role_id = await roleTable({role_name: role});
            if (role_id.length === 0) {
                responseError(res, 403, 'role not found');
                return
            }
            if (role_id[0].id !== user_role_id) {
                responseError(res, 403, 'access denied');
                return
            }
        }

        next();
    }
}