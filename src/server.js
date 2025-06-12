const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const { port } = require('./configs/env.config.js');
const mainRouter = require('./routers/router.js');
const { startKafka } = require('../src/kafka/index.js');
const sendJobNotificationsCron = require('../src/configs/sendJobNotifications.js')

// 1. Kết nối Database
require('./configs/db.config.js');

// 2. Khởi động Kafka (Producer + Consumer)
startKafka();

// 3. Tạo app
const app = express();

// 4. Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://agile-itcv-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Static files & view engine
app.set('view engine', 'hbs');
app.set('templates', path.join(__dirname, 'templates'));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 6. Routing
app.use('/api/v1', mainRouter);

//7. Chạy cronjob
sendJobNotificationsCron()

// 7. Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
