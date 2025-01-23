const express = require("express");
const router = express.Router();
const { registerValidation, validate } = require("../middleware/validators");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const registerMail = require("../middleware/mailer");

router.get("/user/:email", authController.getUser);
router.post("/login", authController.postLogin);
router.post(
  "/register",
  registerValidation,
  validate,
  authController.postRegister
);
router.put(
  "/updateUser/:email",
  auth.authMiddleware,
  // registerValidation,
  // validate,
  authController.updateUser
);

router.post("/authenticate", authController.verifyUser, (req, res) =>
  res.end()
);
router.get("/generateOTP/:email", authController.generateOTP);
router.get("/verifyOTP", authController.verifyOTP);
router.put("/resetPassword", authController.resetPassword);
router.post("/registerMail", registerMail.registerMail);
router.get("/getToken", authController.getToken);
router.post("/logout", authController.logout);

module.exports = router;
