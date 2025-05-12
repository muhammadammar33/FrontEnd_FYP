import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendEmail = async (options: {
    to: string;
    subject: string;
    html: string;
}) => {
    await transporter.sendMail({
        from: `"le'Elysian" <${process.env.SMTP_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
};
