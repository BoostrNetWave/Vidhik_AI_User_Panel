import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER || 'sibsankar2727@gmail.com',
                pass: process.env.SMTP_PASS || 'ulqi aihu ajut qdnl'
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER || 'sibsankar2727@gmail.com',
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('[EmailService] Error sending email:', error);
        return false;
    }
};
