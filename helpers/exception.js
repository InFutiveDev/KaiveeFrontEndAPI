const Constant = require('./constant');
const Response = require('./response');
const Sentry = require('@sentry/node');

const handleException = (logger, res, error) => {
  // Error capture Exception By Sentry
  Sentry.withScope(function (scope) {
    scope.setLevel("error");
    Sentry.captureException(new Error(error));
  });
  const obj = {
    res,
    status: Constant.STATUS_CODE.INTERNAL_SERVER_ERROR,
    msg: error || Constant.ERROR_MSGS.INTERNAL_SERVER_ERROR,
  };
  return Response.error(obj);
};

module.exports = { handleException };
