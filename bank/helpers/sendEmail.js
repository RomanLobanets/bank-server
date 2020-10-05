const nodemailer = require("nodemailer");

async function sendEmail(user, verificationToken) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "extreme.exterminating.NY@gmail.com",
      pass: "Genadiy2020",
    },
  });
  const mailOptions = {
    from: "extreme.exterminating.NY@gmail.com", // sender address
    to: user.email, // list of receivers
    subject: "Verification Email", // Subject line
    html: `<a href='http://localhost:3000/verify/${verificationToken}' >click here please to verify your account</a>`, // plain text body
  };
  try {
    transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
}
module.exports = sendEmail;
