const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

content = content.replace(
`const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');`,
`const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');`);

content = content.replace(
`// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcart')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error: ', err));

// Start Server
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`,
`// Database Connection & Server Start
sequelize.sync({ alter: true }) // use { force: true } to drop tables
    .then(() => {
        console.log('SQLite Database Connected and Synchronized.');
        app.listen(PORT, () => {
            console.log(\`Server running on port \${PORT}\`);
        });
    })
    .catch(err => {
        console.error('SQLite Connection Error: ', err);
    });`);

fs.writeFileSync('server.js', content);
