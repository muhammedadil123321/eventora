const express = require("express");
const router = express.Router();

const { sendEmail } = require("../config/mailer");

router.get("/send", async (req, res) => {
  try {
    await sendEmail(
      process.env.EMAIL_USER,
      "Eventora Email Test",
      "<h2>Congratulations!</h2><p>Nodemailer is working successfully.</p>"
    );

    res.json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error.message);

    res.status(500).json({
      success: false,
      message: "Email sending failed",
      error: error.message,
    });
  }
});

module.exports = router;