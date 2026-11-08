
const nodemailer = require("nodemailer");

const createTransporter = () => {
  const {
    EMAIL_SERVICE,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_HOST,
    EMAIL_PORT,
  } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email credentials are missing in .env");
  }

  if (EMAIL_SERVICE || EMAIL_HOST) {
    return nodemailer.createTransport({
      service: EMAIL_SERVICE || undefined,
      host: EMAIL_HOST || undefined,
      port: EMAIL_PORT ? Number(EMAIL_PORT) : undefined,
      secure: Number(EMAIL_PORT) === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

const sendVendorApprovalEmail = async ({
  vendorEmail,
  vendorName,
  loginUrl,
}) => {
  try {
    const transporter = createTransporter();

    const appLoginUrl =
      loginUrl ||
      `${process.env.CLIENT_URL || "http://localhost:5173"}/vendor/login`;

    const mailOptions = {
      from: `"Eventora CRM" <${process.env.EMAIL_USER}>`,
      to: vendorEmail,
      subject: "Your Eventora Vendor Account Has Been Approved!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 8px;">

          <h2 style="color: #d97706;">Welcome to Eventora!</h2>

          <p>Hello <strong>${vendorName || "Partner"}</strong>,</p>

          <p>
            Congratulations! Your vendor registration has been
            reviewed and approved by the Eventora Admin team.
          </p>

          <p>
            You can now log in to your vendor account and start
            receiving event opportunities.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${appLoginUrl}"
              style="background: #d97706; color: white;
              padding: 13px 25px; text-decoration: none;
              border-radius: 6px; font-weight: bold;">
              Login to Vendor Dashboard
            </a>
          </div>

          <p style="font-size: 13px; color: #777;">
            Login link: ${appLoginUrl}
          </p>

          <hr style="border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 12px; color: #999;">
            Eventora CRM - Event Planning & Booking Management
          </p>

        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Approval email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error("Approval email failed:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};



const sendVendorRejectionEmail = async ({
  vendorEmail,
  vendorName,
}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Eventora CRM" <${process.env.EMAIL_USER}>`,
      to: vendorEmail,
      subject: "Update on Your Eventora Vendor Application",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;
          margin: auto; padding: 25px; border: 1px solid #e5e7eb;
          border-radius: 8px;">

          <h2 style="color: #b45309;">Eventora Vendor Application Update</h2>

          <p>Hello <strong>${vendorName || "Vendor"}</strong>,</p>

          <p>
            Thank you for your interest in joining the Eventora
            vendor network.
          </p>

          <p>
            After reviewing your application, we regret to inform
            you that your vendor registration has not been approved
            at this time.
          </p>

          <p>
            Thank you for your understanding and for considering
            Eventora.
          </p>

          <p>Regards,<br><strong>Eventora Team</strong></p>

          <hr style="border: none; border-top: 1px solid #eee;">

          <p style="font-size: 12px; color: #999; text-align: center;">
            Eventora CRM - Event Planning & Booking Management
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Rejection email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Rejection email failed:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendVendorApprovalEmail,
  sendVendorRejectionEmail,
};


