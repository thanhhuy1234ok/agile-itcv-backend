const express = require('express');
const {port} =require('./configs/env.config.js');
const mainRouter =  require('./routers/router.js');
const sendJobNotificationsCron = require('./configs/sendJobNotifications.js')
require('./configs/db.config.js');
const sendJobNotificationsCron = require('../src/configs/sendJobNotifications.js')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

app.set('view engine', 'hbs');
app.set('templates', path.join(__dirname, 'templates'));

app.use(cors({
    origin: ['http://localhost:3000', 'https://agile-itcv-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname,'../uploads'))); 

app.use('/api/v1', mainRouter);

// sendJobNotificationsCron();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
