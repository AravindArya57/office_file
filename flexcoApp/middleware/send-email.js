const nodemailer = require('nodemailer');
const config = require('../routes/config.json');


module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.emailFrom}) {

    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.verify();
    await transporter.sendMail({ from, to, subject, html });
}