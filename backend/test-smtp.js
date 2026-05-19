require('dotenv').config();
const { sendOrderConfirmation } = require('./utils/sendEmail');

const testEmail = async () => {
    console.log('--- SMTP Connection Test ---');
    console.log('Attempting to send a test order confirmation...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('User:', process.env.SMTP_USER);
    
    const mockUserEmail = process.env.FROM_EMAIL || 'test-user@example.com';
    const mockItems = [
        { name: 'Ultra HD 4K Monitor', qty: 1, price: 24999 },
        { name: 'Premium Wireless Keyboard', qty: 2, price: 3499 }
    ];
    const total = 31997;

    try {
        await sendOrderConfirmation(mockUserEmail, mockItems, total);
        console.log('\nSUCCESS! Test email sent successfully.');
        console.log('Please check your inbox (or Mailtrap) to see the result.');
    } catch (error) {
        console.error('\nERROR: Failed to send test email.');
        console.log('Reason:', error.message);
        console.log('\nTROUBLESHOOTING TIPS:');
        console.log('1. Check your .env file credentials.');
        console.log('2. If using Gmail, ensure you use an "App Password".');
        console.log('3. Ensure your firewall or ISP is not blocking port', process.env.SMTP_PORT);
    }
};

testEmail();
