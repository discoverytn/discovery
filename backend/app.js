// app.js
require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database'); // Note the change here
const app = express();


app.use(express.json());

app.use('/users', userRoutes);

// Add routes for other controllers

// Sync database and start the server
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error synchronizing models:', error);
});
