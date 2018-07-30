const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
// Container for all helpers method
const Helpers = {};

// Create a string of random alphanumeric character of a given length.
Helpers.createRandomString = (strLength) => {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for (let i = 0; i < strLength; i++) {
            // Get a random character for the possible characters.
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }

        return str;
    } else {
        return false;
    }
};

Helpers.sendEmailUsingSendGrid = (to, sub, text, html) => {
    const helper = require('sendgrid').mail;
    const fromEmail = new helper.Email('simdi4iverson@yahoo.co.uk');
    const toEmail = new helper.Email(to);
    const subject = sub;
    const content = new helper.Content('text/plain', text);
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);
    const sg = require('sendgrid')(process.env.SENDGRIDKEY);
    const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, (error, response) => {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
        return response;
    });
};

Helpers.sendEmailUsingNodemail = (to, sub, text, html) => {
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            SMTPSecure: 'tls',
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.NODEMAIL_USER, // generated ethereal user
                pass: process.env.NODEMAIL_PASS // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"You name 👻" simdi4iverson@yahoo.co.uk', // sender address
            to, // list of receivers
            subject: sub, // Subject line
            text, // plain text body
            html // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            return info;
        });
    });
};

module.exports = Helpers;