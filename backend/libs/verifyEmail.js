import nodemailer from "nodemailer";

export const sendVerificationEmail = (html, email) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailConfig = {
    from: "TaskPilot",
    to: email,
    subject: "Verify Your Task Pilot Account",
    html,
  };

  transporter.sendMail(mailConfig, function (error, info) {
    if (error) {
      throw new Error(error);
    }
    console.log("Email Sent Successfully");
    //  console.log(info);
  });
};
