const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const registerMail = require("../middleware/mailer");

router.get("/user", authController.getUser);
router.post("/login", authController.postLogin);
router.post("/register", authController.postRegister);
router.put(
  "/updateUser/:id",
  auth.authMiddleware,
  authController.getUser,
  authController.updateUser
);

router.post("/authenticate", authController.verifyUser, (req, res) =>
  res.end()
);
router.get("/generateOTP", authController.generateOTP);
router.get("/verifyOTP", authController.verifyOTP);
router.put("/resetPassword", authController.resetPassword);
router.post("/registerMail", registerMail.registerMail);
router.get("/getToken", authController.getToken);

module.exports = router;
