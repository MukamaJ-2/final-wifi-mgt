import nodemailer from 'nodemailer';

// Create transporter (you can configure this for your email provider)
const createTransporter = () => {
  // For testing purposes, we'll use a test account
  // In production, replace with your actual email credentials
  const emailUser = process.env.EMAIL_USER || 'test@example.com';
  const emailPassword = process.env.EMAIL_PASSWORD || 'test-password';
  
  // Check if we're using test credentials
  if (emailUser === 'test@example.com' || emailPassword === 'test-password') {
    console.log('📧 Using test email configuration');
    console.log('📧 To set up real email, create a .env file with:');
    console.log('📧 EMAIL_USER=your-email@gmail.com');
    console.log('📧 EMAIL_PASSWORD=your-app-password');
    console.log('📧 Then restart the server');
    
    // Return null to use console logging instead
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });
};

// Helper to format expiration in a unique calendar-like way
const formatExpirationCalendar = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diff = target - now;
  if (isNaN(target.getTime())) return 'Invalid date';
  if (diff <= 0) return '<span style="color:#991b1b;font-weight:bold">Expired</span>';
  let seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return `
    <span style="display:inline-block;text-align:center;min-width:60px;">
      <span style="display:inline-block;background:#e0e7ff;color:#3730a3;font-weight:bold;padding:2px 8px;border-radius:6px;margin:0 2px;">${days}d</span>
      <span style="display:inline-block;background:#f1f5f9;color:#0f172a;font-weight:bold;padding:2px 8px;border-radius:6px;margin:0 2px;">${hours}h</span>
      <span style="display:inline-block;background:#fef9c3;color:#92400e;font-weight:bold;padding:2px 8px;border-radius:6px;margin:0 2px;">${minutes}m</span>
      <span style="display:inline-block;background:#fee2e2;color:#991b1b;font-weight:bold;padding:2px 8px;border-radius:6px;margin:0 2px;">${seconds}s</span>
    </span>
  `;
};

// Send user credentials email
export const sendUserCredentials = async (userData) => {
  try {
    const transporter = createTransporter();
    
    // If no transporter (email not configured), log credentials to console
    if (!transporter) {
      console.log('\n📧 ===== USER CREDENTIALS EMAIL =====');
      console.log('📧 To: ' + userData.email);
      console.log('📧 Subject: Your Guest Access Credentials');
      console.log('📧');
      console.log('📧 Dear ' + (userData.full_name || 'User') + ',');
      console.log('📧');
      console.log('📧 Your guest access has been created successfully.');
      console.log('📧');
      console.log('📧 LOGIN CREDENTIALS:');
      console.log('📧 Username: ' + userData.username);
      console.log('📧 Password: ' + userData.plainPassword);
      console.log('📧 Access Expires: ' + new Date(userData.expires_at).toLocaleDateString());
      console.log('📧');
      console.log('📧 IMPORTANT NOTES:');
      console.log('📧 - Please keep your credentials secure');
      console.log('📧 - Your access will expire on ' + new Date(userData.expires_at).toLocaleDateString());
      console.log('📧 - Contact the administrator if you need assistance');
      console.log('📧');
      console.log('📧 This is an automated message. Please do not reply.');
      console.log('📧 ============================================\n');
      
      return { 
        success: true, 
        message: 'Credentials logged to console (email not configured)' 
      };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userData.email,
      subject: 'Your Guest Access Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Our System!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your guest access has been created successfully.</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Your Login Credentials</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Login Information</h3>
              <p style="margin: 5px 0;"><strong>Username:</strong> <span style="background: #e9ecef; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${userData.username}</span></p>
              <p style="margin: 5px 0;"><strong>Password:</strong> <span style="background: #e9ecef; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${userData.plainPassword}</span></p>
              <p style="margin: 5px 0;"><strong>Access Expires:</strong> ${formatExpirationCalendar(userData.expires_at)}</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #856404;">Important Notes</h4>
              <ul style="margin: 0; padding-left: 20px; color: #856404;">
                <li>Please keep your credentials secure</li>
                <li>Your access will expire in ${formatExpirationCalendar(userData.expires_at)}</li>
                <li>Contact the administrator if you need assistance</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you have any questions, please contact your system administrator.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', userData.email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('⚠️ Email not configured - using console logging');
      console.log('📧 To set up real email:');
      console.log('📧 1. Create a .env file in the backend directory');
      console.log('📧 2. Add: EMAIL_USER=your-email@gmail.com');
      console.log('📧 3. Add: EMAIL_PASSWORD=your-app-password');
      console.log('📧 4. Restart the server');
      return false;
    }
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration failed:', error.message);
    return false;
  }
}; 