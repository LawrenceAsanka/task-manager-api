const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'asankalorance@gmail.com',
        subject: 'Welcome to the world!',
        text: `Welcome to the hello world ${name}.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'asankalorance@gmail.com',
        subject: 'Account Cancellation!',
        text: `Why ${name} you left from ud!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}