import nodemailer from "nodemailer";

export const sendMail = async (toEmail, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
