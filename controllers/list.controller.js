const {statusTable} = require("../models/status.model");
const {mediaTable} = require("../models/media.model");
const {linkTable} = require("../models/link.model");
const {divTable} = require("../models/div.model");
const {roleTable} = require("../models/role.model");
const {userTable} = require('../models/user.model');
const {
    responseError,
    responseData
} = require("../utils/responseHandler");

exports.getStatus = async (req, res) => {
    try {
        const query = req.query;

        const params = {};
        if (query.status_id) {
            params.status_id = query.status_id;
        }

        const status = await statusTable(params);
        if (status.length === 0) {
            responseError(res, 400, [], 'tidak ada');
        }

        const data = status.map(e => {
            return {
                status_id: e.id,
                status_value: e.value,
            };
        })

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err)
    }
}

exports.getMedia = async (req, res) => {
    try {
        const query = req.query;

        const params = {};
        if (query.media_id) {
            params.media_id = query.media_id;
        }

        const media = await mediaTable(params);
        if (media.length === 0) {
            responseError(res, 400, [], 'tidak ada');
            return;
        }

        const data = media.map(e => {
            return {
                media_id: e.id,
                media_label: e.label,
                media_uri: e.uri,
            };
        })

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err)
    }
}

exports.getLink = async (req, res) => {
    try {
        const query = req.query;

        const params = {};
        if (query.link_id) {
            params.link_id = query.link_id;
        }

        const link = await linkTable(params);
        if (link.length === 0) {
            responseError(res, 400, [], 'tidak ada');
            return;
        }

        const data = link.map(e => {
            return {
                link_id: e.id,
                link_uri: e.uri,
            };
        })

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err)
    }
}

exports.getDiv = async (req, res) => {
    try {
        const query = req.query;

        const params = {};
        if (query.div_id) {
            params.div_id = query.div_id;
        }
        if (query.div_name) {
            params.div_name = query.div_name;
        }

        const div = await divTable(params);
        if (div.length === 0) {
            responseError(res, 400, [], 'tidak ada');
            return;
        }

        const data = div.map(e => {
            return {
                div_id: e.id,
                div_name: e.name,
            };
        })

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err)
    }
}

exports.getRole = async (req, res) => {
    try {
        const query = req.query;

        const params = {};
        if (query.role_id) {
            params.role_id = query.role_id;
        }
        if (query.role_name) {
            params.role_name = query.role_name;
        }

        const role = await roleTable(params);
        if (role.length === 0) {
            responseError(res, 400, [], 'tidak ada');
            return;
        }

        const data = role.map(e => {
            return {
                role_id: e.id,
                role_name: e.name,
            };
        })

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err)
    }
}

exports.getUser = async (req, res) => {
    try {
        const query = req.query;

        const params = {};
        if (query.user_id) {
            params.user_id = query.user_id;
        }
        if (query.username) {
            params.username = query.username;
        }
        if (query.name) {
            params.name = query.name;
        }
        if (query.div_id) {
            params.div_id = query.div_id;
        }
        if (query.div_name) {
            params.div_name = query.div_name;
        }
        if (query.role_id) {
            params.role_id = query.role_id;
        }
        if (query.role_name) {
            params.role_name = query.role_name;
        }

        const user = await userTable(params);
        if (user.length === 0) {
            responseError(res, 400, [], 'tidak ada');
            return;
        }

        const data = user.map(e => {
            const data = {
                user_id: e.id,
                username: e.username,
                name: e.user_name,
                div: {
                    id: e.div_id,
                    name: e.div_name,
                },
                role: {
                    id: e.role_id,
                    name: e.role_name,
                },
            }
            data.media = null;
            if (e.media_id) {
                data.media = {
                    id: e.media_id,
                    label: e.label,
                    uri: e.uri,
                }
            }
            return data;
        })

        responseData(res, 200, data);
    } catch (err) {
        responseError(res, 400, err)
    }
}