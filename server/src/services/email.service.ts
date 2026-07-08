import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

let resend: Resend | null = null;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!resend) {
    console.log(`
=========================================
[EMAIL MOCK] Sending Mail
To: ${to}
Subject: ${subject}
Content: ${html.substring(0, 300)}... (truncated)
=========================================
    `);
    return { id: `mock_email_${Date.now()}` };
  }

  try {
    const data = await resend.emails.send({
      from: 'Lumen x Deli <noreply@lumendeli.com>',
      to: [to],
      subject: subject,
      html: html,
    });
    return data;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  const subject = 'Welcome to Lumen x Deli';
  const html = `
    <div style="font-family: sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 8px;">
      <h1 style="color: #ff3366; font-size: 28px;">LUMEN X DELI</h1>
      <p>Hello ${name},</p>
      <p>Welcome to Lumen x Deli. We design and build premium 3D printed lamps and high-performance drone structural engineering parts.</p>
      <a href="${clientUrl}/shop" style="display: inline-block; background: #ffffff; color: #000000; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 20px;">Explore Our Catalog</a>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendVerificationEmail = async (to: string, name: string, token: string) => {
  const subject = 'Verify your email address';
  const verifyLink = `${clientUrl}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 8px;">
      <h1 style="color: #ff3366; font-size: 28px;">LUMEN X DELI</h1>
      <p>Hello ${name},</p>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verifyLink}" style="display: inline-block; background: #00e5ff; color: #000000; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 20px;">Verify Email</a>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">Or copy-paste: ${verifyLink}</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (to: string, name: string, token: string) => {
  const subject = 'Reset your password';
  const resetLink = `${clientUrl}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 8px;">
      <h1 style="color: #ff3366; font-size: 28px;">LUMEN X DELI</h1>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <a href="${resetLink}" style="display: inline-block; background: #e040fb; color: #ffffff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 20px;">Reset Password</a>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 1 hour.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendOrderConfirmationEmail = async (to: string, name: string, orderId: string, total: number) => {
  const subject = `Order Confirmation #${orderId.substring(orderId.length - 6)}`;
  const html = `
    <div style="font-family: sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 8px;">
      <h1 style="color: #ff3366; font-size: 28px;">LUMEN X DELI</h1>
      <p>Hello ${name},</p>
      <p>Thank you for your order! Your payment was received, and our manufacturing team is initiating production.</p>
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
      <a href="${clientUrl}/dashboard/orders" style="display: inline-block; background: #ffffff; color: #000000; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 20px;">Track Order Status</a>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendSupportTicketEmail = async (toEmail: string, category: string, subjectLine: string, messageBody: string) => {
  const subject = `[SUPPORT TICKET] ${category}: ${subjectLine}`;
  const html = `
    <div style="font-family: sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 8px;">
      <h1 style="color: #ffd600; font-size: 24px;">LUMEN X DELI</h1>
      <p>A new support transmission has been logged.</p>
      <h3>Inquiry Details</h3>
      <p><strong>From:</strong> ${toEmail}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Subject:</strong> ${subjectLine}</p>
      <p><strong>Message Parameters:</strong></p>
      <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 4px; border-left: 3px solid #00e5ff;">
        ${messageBody.replace(/\n/g, '<br />')}
      </div>
    </div>
  `;
  try {
    // Send administrative notification email copy
    await sendEmail('dispatch@lumendeli.com', subject, html);
  } catch (err) {
    console.error('Error sending admin copy:', err);
  }
  // Send customer confirmation copy
  return sendEmail(toEmail, `Support Ticket Logged: ${subjectLine}`, html);
};
