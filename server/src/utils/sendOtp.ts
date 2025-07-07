import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const otpStore = new Map<string, string>();

export const generateAndSendOtp = async (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, otp); // store temporarily

    const msg = {
        to: email,
        from: "rohillamudit679@gmail.com",
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    };

    console.log(otp);

    await sgMail.send(msg);
    return true;
};

export const verifyStoredOtp = (email: string, code: string) => {
    const valid = otpStore.get(email) === code;
    if (valid) otpStore.delete(email); // OTP can only be used once
    return valid;
};
