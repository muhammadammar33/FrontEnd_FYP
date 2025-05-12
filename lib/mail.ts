// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);
import { sendEmail } from './sendmail';

// const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    await sendEmail({
        to: email,
        subject: '2FA Code',
        html: `<p>Your 2FA code: ${token}</p>`,
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
    // const resetLink = `${domain}/auth/new-password?token=${token}`;

    await sendEmail({
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
};

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
    // const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    console.log(confirmLink);
    console.log(email);

    await sendEmail({
        to: email,
        subject: 'Confirm your email' + token,
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
};