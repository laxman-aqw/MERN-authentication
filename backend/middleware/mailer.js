require("dotenv").config(); // Load environment variables

const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "CLMS",
    link: "http://localhost:8080/",
  },
});

exports.registerMail = async (req, res) => {
  try {
    const { username, email, text, subject } = req.body;
    const emailContent = {
      body: {
        name: username,
        intro: text || "Welcome to Our App",
        action: {
          instructions: "Click the button below to get started:",
          button: {
            color: "#22BC66",
            text: "Get Started",
            link: "https://youtube.com",
          },
        },
        outro: "Need help? Contact us anytime!",
      },
    };

    const emailBody = mailGenerator.generate(emailContent);
    const emailText = mailGenerator.generatePlaintext(emailContent);

    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject || "Registration successful",
      text: emailText,
      html: emailBody,
    };

    await transporter.sendMail(message);
    res.status(200).json({
      success: true,
      message: "A registration email has been sent to your email address.",
    });
  } catch (err) {
    console.error("Error sending registration email:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send registration email. Please try again later.",
      error: err.message,
    });
  }
};
