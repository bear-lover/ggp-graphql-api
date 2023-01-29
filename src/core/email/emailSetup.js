'use strict';
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
import { getUserEmail, getConfigurationData } from './helpers/getUserEmail';

const sendEmail = app => {

    app.post('/sendEmail', async function (req, res, next) {

        const emailData = await getConfigurationData({ name: ['smtpHost', 'smtpPort', 'smptEmail', 'smtpSender', 'smtpSenderEmail', 'smtpPassWord'] });

        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport(smtpTransport({
            host: emailData.smtpHost,
            port: parseInt(emailData.smtpPort),
            auth: {
                user: emailData.smptEmail,
                pass: emailData.smtpPassWord
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: emailData.tls == 'true' ? 1 : 0
            }
        }));

        let mailOptions = req.body.mailOptions;
        let from = emailData.smtpSender + '<' + emailData.smtpSenderEmail + '>';

        if (mailOptions && mailOptions.to && mailOptions.to.indexOf('@') < 0) {
            mailOptions['to'] = await getUserEmail(mailOptions.to);
        }

        mailOptions['from'] = from; // Sender email(Platform/Admin)

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.send({ status: 400, response: error });
            }
            return res.send({ status: 200, response: 'email send successfully' });
        });
    });

};

export default sendEmail;  