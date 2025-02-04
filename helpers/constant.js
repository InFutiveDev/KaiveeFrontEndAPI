module.exports = {
  STATUS_CODE: {
    OK: 200,
    TRIPLEA: 151,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    INFO: 250,
    NON_AUTHORITATIVE: 203,
    BAD_REQUEST: 400,
    UN_AUTHORIZED: 401,
    FORBIDDEN: 403,
    RESOURCE_NOT_FOUND: 404,
    PROXY_AUTH_FAILED: 412,
    TOO_MANY_REQUESTS: 429,
    VALIDATION_FAILURE: 450,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    SERVER_TIMEOUT: 504,
  },
  ERROR_MSGS: {
    DATA_NOT_FOUND:"Data Not Found",
    INVALID_COUPON_CODE:"Invalid Coupon Code",
    LESS_AMOUNT:"your cart amount is less than discount amount",
    COUPON_EXPIRED:"Expired Coupon Code",
    OTP_INVALID: "Your OTP Is Invalid",
    INTERNAL_SERVER_ERROR: "Unable to process,Please Try Again",
    ACCOUNT_EXISTS: "Account already exists. Please login",
    ACCOUNT_DISABLED:
      "Your account has been disabled, please reach out to our support",
    ACCOUNT_NOT_FOUND: "Account not found",
    ACCOUNT_BLOCKED:
      "Your account has been blocked, please reach out to our support",
    ACCOUNT_LOCKED:
      "Your account has been blocked, please use forgot password option to reset password and login.",
    ACCOUNT_LOCKED_EMAIL_TRIGGERED:
      "Your account has been blocked, mail has been triggered to reset password.",
    IP_LOCKED: "Please try again later.",
    USER_NOT_FOUND: "User not found",
    INVALID_LOGIN: "Invalid email or/and password.",
    INVALID_COUPON: "Invalid Coupon-Code.",
    AMOUNT_MISMATCH: "Order Amount Mismatch Please Create New Order or Contact City Xray Customer Care",
    TOKEN_SESSION_EXPIRED: "Token Expired!!",
  },
  INFO_MSGS: {
    NO_DATA: "No data found",
    CREATED_SUCCESSFULLY: "Created successfully",
    PAYMENT_LINK_CREATED_SUCCESSFULLY: "Payment Link Created successfully",
    UPDATED_SUCCESSFULLY: "Updated successfully",
    DELETED_SUCCESSFULLY: "Deleted successfully",
    OTP_SENT_SUCCESSFULLY: "OTP Successfully Sent !!",
    SUCCESS: "Request Success",
    SUCCESSFUL_REGISTER:
      "Your registration with Brant Ford India is successful.",
    SUCCESSFUL_UPDATE: "Successfully updated",
    WELCOME_MSG: "Welcome to Client API Services_v4.",
    SUCCESSFUL_LOGIN: "Successfully logged in.",
    SUCCESSFUL_ENABLE: "2FA enabling requested successfully.",
    SUCCESSFUL_RESET: "2FA is successfully reset on your request.",
    PASSWORD_CHANGED: "Your password has been changed successfully.",
    VERIFICATION_EMAIL: "Verification Email send successfully.",
    EMAIL_NOT_VERIFIED: "Email not verified, Please verify it.",
    EMAIL_VERIFIED: "Email already Verified. Please login",
    EMAIL_SEND: "Email sent to the registered account.",
    ACCOUNT_VERIFIED: "Your account has been verified, Please login.",
    TWO_FACTOR_SUCCESS: "Successfully configured 2FA",
    TWO_FACTOR_ENABLED: "2FA enabled successfully",
    TWO_FACTOR_DISABLED: "2FA disabled successfully",
    SUCCESSFUL_LOGOUT: "Successfully logged out.",
    USERNAME_AVAILABLE: "Username available",
    USERNAME_NOT_AVAILABLE: "Username not available",
  },
};
