'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const signUpRouter = require('../src/routs/signin');
const signInRouter = require('../src/routs/signup');
const fBOauth = require('../src/routs/facebookauth');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(signUpRouter);
app.use(signInRouter);
app.use(fBOauth);

module.exports = {
    server: app,
    start: () => {
        const PORT = process.env.PORT || 3030;
        app.listen(PORT, () => { console.log(`listining on PORT ${PORT}`); });
    },
};