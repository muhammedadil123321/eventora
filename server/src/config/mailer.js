const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, message) => {
  return await transporter.sendMail({
    from: `"Eventora CRM" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: message,
  });
};

module.exports = { sendEmail };