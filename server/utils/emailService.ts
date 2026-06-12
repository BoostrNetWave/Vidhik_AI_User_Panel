import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER || 'sibsankar2727@gmail.com',
                pass: process.env.SMTP_PASS || 'ulqi aihu ajut qdnl'
            },
            connectionTimeout: 5000 // 5 seconds connection timeout
        });

        const mailOptions = {
            from: process.env.SMTP_USER || 'sibsankar2727@gmail.com',
            to,
            subject,
            html
        };

        // Fire-and-forget email sending in the background to prevent blocking HTTP requests.
        // This resolves hanging requests caused by AWS port 25 blocking.
        transporter.sendMail(mailOptions)
            .then((info) => {
                console.log('[EmailService] Email sent successfully: ' + info.response);
            })
            .catch((error) => {
                console.error('[EmailService] Async email sending failed:', error);
            });

        return true;
    } catch (error) {
        console.error('[EmailService] Error initializing email send:', error);
        return false;
    }
};
