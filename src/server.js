const express = require('express');
const {port} =require('./configs/env.config.js');
const mainRouter =  require('./routers/router.js');
require('./configs/db.config.js');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

app.set('view engine', 'hbs');
app.set('templates', path.join(__dirname, 'templates'));

app.use(cors({
    origin: 'http://localhost:3000', // Chỉ cho phép từ FE ở port 3000
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    credentials: true // Nếu cần gửi cookie qua cross-origin
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname,'../uploads'))); 

app.use('/api/v1', mainRouter);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
