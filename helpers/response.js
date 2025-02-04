const statusCode = require('./constant');
const Sentry = require('@sentry/node');

const response = {
  statusCode: statusCode.STATUS_CODE.OK,
  msg: 'Request Success',
  errorMessage: 'Something went wrong, Kindly try again',
  success: function ({ res, headers, status, msg, data }) {
    // Sentry.withScope(function (scope) {
    //   scope.setLevel("info");
    //   Sentry.captureException(new Error(data));
    // });
    if (headers) {
      res.set(headers);
    }
    if (!data) {
      this.statusCode = statusCode.STATUS_CODE.NO_CONTENT;
    }
    res.status(status || this.statusCode).json({
      msg: msg || this.message,
      data: data,
    });
  },
  error: function ({ res, headers, status, msg, data }) {
    Sentry.withScope(function (scope) {
      scope.setLevel("error");
      Sentry.captureException(new Error(data));
    });

    if (headers) {
      res.set(headers);
    }
    res.status(status || 400).json({
      msg: msg || this.errorMessage,
      data: data,
    });
  },
};

module.exports = response;
