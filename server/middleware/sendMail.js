const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transport.verify((error, success) => {
  if (error) {
    console.error("Email transporter configuration error:", error);
  } else {
    console.log("Email transporter is ready to send messages");
  }
});

exports.sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Verify Your Email - Movie Booking",
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
    console.log("Attempting to send email to:", email);
    console.log("Verification link:", verificationLink);

    const result = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    console.error("Error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
    });
    return false;
  }
};
