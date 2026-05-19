const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

content = content.replace(
    `const paymentRoutes = require('./routes/paymentRoutes');`,
    `const paymentRoutes = require('./routes/paymentRoutes');\nconst adminRoutes = require('./routes/adminRoutes');`
);

content = content.replace(
    `app.use('/api/payment', paymentRoutes);`,
    `app.use('/api/payment', paymentRoutes);\napp.use('/api/admin', adminRoutes);`
);

fs.writeFileSync('server.js', content);
