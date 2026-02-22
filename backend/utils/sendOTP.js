import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTP = async (email, otp, name) => {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === '') {
    console.log('\n🔐 OTP EMAIL (MOCK MODE)');
    console.log('='.repeat(50));
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`OTP Code: ${otp}`);
    console.log('='.repeat(50));
    console.log('✅ Add RESEND_API_KEY to .env for real email delivery\n');
    return { success: true, mock: true };
  }

  try {
    await resend.emails.send({
      from: 'RailGourmet <onboarding@resend.dev>',
      to: [email],
      subject: 'Your OTP for Train Food Order App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FDFBF7;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #E65100; font-size: 32px; margin: 0;">🚂 RailGourmet</h1>
            <p style="color: #64748b; margin-top: 5px;">Dining at 100km/h</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 16px; border: 2px solid #e2e8f0;">
            <h2 style="color: #0F172A; margin-top: 0;">Hello ${name}!</h2>
            <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
              Your OTP for verification is:
            </p>
            
            <div style="background: linear-gradient(135deg, #E65100 0%, #D4AF37 100%); padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0;">
              <h1 style="color: white; font-size: 48px; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0;">
                ${otp}
              </h1>
            </div>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              This OTP will expire in <strong>10 minutes</strong>.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              © 2024 RailGourmet. All rights reserved.
            </p>
          </div>
        </div>
      `
    });
    console.log(`✅ OTP email sent to ${email}`);
    return { success: true, mock: false };
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw new Error('Failed to send OTP email');
  }
};