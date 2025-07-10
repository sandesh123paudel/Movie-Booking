const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, "../.env") });

// Create reusable transporter object using SMTP transport
let transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendVerificationEmail = async (email, verificationToken) => {
  // Validate environment variables before sending
  if (
    !process.env.EMAIL_ADDRESS ||
    !process.env.EMAIL_PASSWORD ||
    !process.env.CLIENT_URL
  ) {
    console.error("Missing required environment variables for sending email");
    return false;
  }

  if (!email || !verificationToken) {
    console.error("Missing required parameters:", {
      email: !!email,
      token: !!verificationToken,
    });
    return false;
  }

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: `"Movie Booking" <${process.env.EMAIL_ADDRESS}>`,
    to: email,
    subject: "Verify Your Email - Movie Booking",
    text: `Please verify your email by clicking this link: ${verificationLink}`,
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}" style="
        background-color: #4CAF50;
        color: white;
        padding: 14px 25px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        border-radius: 4px;
        margin: 10px 0;
      ">Verify Email</a>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  try {
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
