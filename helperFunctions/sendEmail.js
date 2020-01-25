const nodemailer = require("nodemailer");

module.exports = async function (to, subject, html) {

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USERNAME, 
      pass: process.env.GMAIL_PASSWORD,
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Ahmed Ragab" <hamadar1996@gmail.com>', // sender address
    to, // list of receivers seperated by commas
    subject, // Subject line
    html, // html body
  });

  console.log('Message Sent');
}