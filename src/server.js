const express = require('express');
const {port} =require('./configs/env.config.js');
const mainRouter =  require('./routers/index.js');
require('./configs/db.config.js');
const app = express();
const bcrypt = require('./utils/bcrypt.password.js');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/v1', mainRouter);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
