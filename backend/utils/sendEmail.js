const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'SmartCart'} <${process.env.FROM_EMAIL || 'noreply@smartcart.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log('Email sent: %s', info.messageId);
};

const sendOrderConfirmation = async (userEmail, orderItems, totalPrice) => {
    const itemsHtml = orderItems.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <strong>${item.name || 'Product'}</strong><br>
                <span style="color: #666; font-size: 0.9em;">Qty: ${item.qty}</span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                ₹${item.price.toLocaleString()}
            </td>
        </tr>
    `).join('');

    const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 20px;">
            <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 28px; letter-spacing: -1px;">SmartCart</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9;">Order Confirmation</p>
                </div>
                
                <div style="padding: 30px;">
                    <h2 style="color: #0f172a; margin-top: 0;">Thank you for your order!</h2>
                    <p>We're thrilled you chose SmartCart. Your items are being prepared for shipment.</p>
                    
                    <div style="margin: 25px 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f1f5f9;">
                                    <th style="padding: 12px; text-align: left; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.05em;">Product</th>
                                    <th style="padding: 12px; text-align: right; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.05em;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 1.1em;">Total</td>
                                    <td style="padding: 15px 12px; text-align: right; font-weight: bold; color: #7c3aed; font-size: 1.25em;">₹${totalPrice.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="#" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: 600; display: inline-block;">Track Your Order</a>
                    </div>
                </div>
                
                <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 0.85em; color: #64748b;">
                    <p style="margin: 0;">© 2026 SmartCart Inc. All rights reserved.</p>
                    <p style="margin: 5px 0;">Premium Web Store Experience</p>
                </div>
            </div>
        </div>
    `;

    await sendEmail({
        email: userEmail,
        subject: 'Your SmartCart Order Confirmation - #SC' + Math.floor(100000 + Math.random() * 900000),
        message: `Thank you for your order! Total: ₹${totalPrice}`,
        html: html
    });
};

module.exports = { sendEmail, sendOrderConfirmation };
