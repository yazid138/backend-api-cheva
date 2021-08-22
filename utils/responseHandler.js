exports.responseData = (response, statusCode, values, totalData = null, pagination = {}) => {
    const data = {
        status: statusCode,
        data: values,
    };
    if (totalData !== null) {
        data.total_data = totalData;
    }
    data.pagination = {}
    if (pagination.current_page) {
        data.pagination.current_page = pagination.current_page;
    }
    if (pagination.limit) {
        data.pagination.limit = pagination.limit;
    }
    if (pagination.max_page) {
        data.pagination.max_page = pagination.max_page;
    }

    response.status(statusCode).json(data)
}

exports.responseMessage = (response, statusCode, message) => {
    const data = {
        status: statusCode,
        message: message,
    };

    response.status(statusCode).json(data);
}

exports.responseError = (response, statusCode, err, message) => {
    const data = {
        status: statusCode,
        message: message,
        error: err
    };

    response.status(statusCode).json(data);
}