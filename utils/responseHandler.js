exports.responseData = (response, statusCode, values) => {
    const data = {
        status: statusCode,
        data: values
    };

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