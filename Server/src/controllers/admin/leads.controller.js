const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { query } = require('../../config/db');

const transporter = nodemailer.createTransport({
  host: 'promoterproperty.com',
  port: 587,
  secure: false,
  auth: {
    user: 'leads@promoterproperty.com',
    pass: 'zrnpLmUuq5UzT8R',
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service connected successfully');
  }
});

const sendAdminNotificationEmail = async (leadData) => {
  try {
    const mailOptions = {
      from: 'leads@promoterproperty.com',
      to: 'leads@promoterproperty.com',
      subject: `New Lead: ${leadData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #1a73e8;">New Lead Received</h2>
          <hr style="border: none; border-top: 2px solid #1a73e8;">
          <h3>Lead Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${leadData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${leadData.email || 'N/A'}</td>
            </tr>
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${leadData.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${leadData.message || 'N/A'}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 2px solid #1a73e8; margin-top: 20px;">
          <p style="color: #666; font-size: 12px;">Received at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin email sent');
  } catch (error) {
    console.error('❌ Admin email error:', error);
  }
};

const sendLeadConfirmationEmail = async (leadData) => {
  try {
    if (!leadData.email) return;
    const mailOptions = {
      from: 'leads@promoterproperty.com',
      to: leadData.email,
      subject: 'We Received Your Inquiry - Promoter Property',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
          <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0;">Promoter Property</h1>
            <p style="margin: 5px 0 0 0;">Your Trusted Real Estate Partner</p>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #1a73e8;">Thank You, ${leadData.name}!</h2>
            <p>We have received your inquiry and appreciate your interest.</p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #1a73e8; margin: 20px 0;">
              <p><strong>Name:</strong> ${leadData.name}</p>
              <p><strong>Phone:</strong> ${leadData.phone}</p>
              <p><strong>Email:</strong> ${leadData.email}</p>
            </div>
            <p>Our team will contact you shortly!</p>
            <p style="color: #666;"><strong>Contact:</strong><br>Phone: +918939000065<br>Email: leads@promoterproperty.com</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; text-align: center;">© 2025 Promoter Property</p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Lead confirmation email sent');
  } catch (error) {
    console.error('❌ Confirmation email error:', error);
  }
};

router.post('/leads', async (req, res) => {
  const { name, phone, email, message, propertyId, brokerId } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required.' });
  }

  try {
    const result = await query(
      'INSERT INTO Leads (name, phone, email, message, propertyId, brokerId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, phone, email || null, message || null, propertyId || null, brokerId || null]
    );

    sendAdminNotificationEmail({ name, phone, email, message, propertyId, brokerId });
    sendLeadConfirmationEmail({ name, phone, email, message });

    res.status(200).json({ 
      message: 'Lead saved successfully!',
      leadId: result.insertId
    });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ 
      message: 'Failed to save lead.',
      error: error.message 
    });
  }
});

router.get('/leads', async (req, res) => {
  try {
    const allLeads = await query('SELECT * FROM Leads ORDER BY createdAt DESC');
    res.status(200).json(allLeads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Failed to fetch leads.' });
  }
});

module.exports = router;
