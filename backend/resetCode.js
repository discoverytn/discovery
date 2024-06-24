const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.SenderEmail,
    pass: process.env.SenderPW,
  },
});

const sendResetCodeEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.SenderEmail,
    to: email,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset code sent successfully");
  } catch (error) {
    console.error("Error sending password reset code:", error);
    throw new Error("Failed to send reset code");
  }
};

const generateResetCode = () => {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  return resetCode;
};

module.exports = { sendResetCodeEmail, generateResetCode };
