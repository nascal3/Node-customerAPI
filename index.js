const express = require('express');
const logger = require('./middleware/logger');
const app = express();

// CALL TO UNCAUGHT AND UNHANDLED
require('./startup/logging')();

// CALL TO DB CONNECTION FOLDER
require('./startup/db')();

// CALL TO ROUTES FOLDER
require('./startup/routes')(app);

//CALL TO CONFIG FOLDER
require('./startup/config')();

const port = process.env.PORT || 3000;
app.listen( port, () => logger.info(`express running on port ${port}...`));