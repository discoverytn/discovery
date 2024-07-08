const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.SenderEmail,
    pass: process.env.SenderPW,
  },
});

const approveEmail = async (recipientEmail) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SenderEmail,
      to: recipientEmail,
      subject: 'Your Application Approval',
      html: `
        <p>Dear Applicant,</p>
        <p>Your application to Discovery TN has been approved. Congratulations!</p>
        <p>Best regards,</p>
        <p>The Discovery TN Team</p>
      `,
    });
    console.log('Approval email sent:', info.messageId);
    return info; 
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error; 
  }
};

const declineEmail = async (recipientEmail) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SenderEmail,
      to: recipientEmail,
      subject: 'Application Declined',
      html: `
        <p>Dear Applicant,</p>
        <p>We regret to inform you that your application to Discovery TN has been declined.</p>
        <p>Best regards,</p>
        <p>The Discovery TN Team</p>
      `,
    });
    console.log('Decline email sent:', info.messageId);
    return info; 
  } catch (error) {
    console.error('Error sending decline email:', error);
    throw error; 
  }
};

module.exports = { transporter, approveEmail, declineEmail };
