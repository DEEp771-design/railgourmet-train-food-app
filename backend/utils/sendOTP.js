import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendOTP = async (email, otp, name) => {
  // Mock OTP sending - logs to console
  // When RESEND_API_KEY is added, this will send real emails
  
  if (!resend) {
    console.log('\n🔐 OTP EMAIL (MOCK MODE)');
    console.log('=' .repeat(50));
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`OTP Code: ${otp}`);
    console.log('=' .repeat(50));
    console.log('✅ Add RESEND_API_KEY to .env for real email delivery\n');
    return { success: true, mock: true };
  }

  try {
    await resend.emails.send({
      from: 'RailGourmet <onboarding@resend.dev>',
      to: [email],
      subject: 'Your OTP for Train Food Order App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E65100;">Hello ${name}!</h2>
          <p>Your OTP for verification is:</p>
          <h1 style="color: #E65100; font-size: 36px; letter-spacing: 5px; font-family: 'Courier New', monospace;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
    return { success: true, mock: false };
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw new Error('Failed to send OTP');
  }
};