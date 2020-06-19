'use strict';

////require
//external packages and modules
const express = require('express'); const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

//internal modules
const router = require('../src/router');

//error middleware
const notFoundError = require('../middleware/errors/404');
const serverError = require('../middleware/errors/500');

////////////////////////////////

////global middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

////////////////////////////////

////handle routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome To Talkitover! Server\'s Up And Running..');
});

// app.use(router);

////////////////////////////////

////handle errors
//404 errors
// app.use('*', notFoundError);
//500 errors
// app.use(serverError);

////////////////////////////////

module.exports = {
  server: app,
  start: (port) =>{
    const PORT = port || process.env.PORT;
    app.listen(PORT, () => console.log(`Listening On Port: ${PORT}\n`));
  },
};
