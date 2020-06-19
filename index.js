'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const PORT=process.env.PORT || 3000;
const server = require('./lib/server');
// const mongooseOptions = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// };

server.start(PORT);
// mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
