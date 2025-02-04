const express = require('express');
const router = express.Router();
const Registration = require('../controller/authentication/registration');
const UserLock = require('../middlewares/account-lock-email');
const IPLock = require('../middlewares/account-lock-ip');
const Login = require('../controller/authentication/login');
const { auth } = require('../middlewares/auth');

router.post(
    '/register/email',
    Registration.registerWithEmailAndPassword,
);
router.post(
    '/register/OTP',
    Registration.OtpVerifyAndRegister,
);

router.post(
    '/send-otp',
    Registration.sendOtp,
);
router.post('/email-verify', Registration.emailVerify);
router.post('/resend-email', Registration.resendEmailVerification);
router.post('/forgot-password', Registration.forgotPasswordLink);
router.post('/reset-password', Registration.resetPassword);
router.post('/login', IPLock.accountActivity, UserLock.accountActivity, Login.login);


router.use(auth);
router.post('/token', Login.refreshToken);

module.exports = router;