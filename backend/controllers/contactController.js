const { sendEmail } = require('../utils/sendEmail');

const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide name, email, and message.' });
        }

        // Send the email to the admin email account
        const adminEmail = process.env.SMTP_USER || 'smartcartai7@gmail.com';
        
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #7c3aed;">
                    ${message}
                </blockquote>
            </div>
        `;

        await sendEmail({
            email: adminEmail,
            subject: `New Contact Inquiry from ${name}`,
            message: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: html
        });

        res.status(200).json({ message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Contact Form Error:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
};

module.exports = { submitContactForm };