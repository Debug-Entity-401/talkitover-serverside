'use strict';

const server = require('./lib/server');
const mongoose = require('mongoose');
require('dotenv').config();


const MONGODB_URI = process.env.MONGODB_URI;

server.start();

const mongooseOptipn = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
};


mongoose.connect(MONGODB_URI, mongooseOptipn);