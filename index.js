/* 
 * Upstack Application
 */

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const mongoose = require('mongoose');
const routes = require('./routes');
const port = process.env.PORT || 9000;
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/upstack', (err) => {
  if (err) {
      console.log('Connection error');
  } else {
      console.log('Connected');
  }
});

const app = express();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => { res.send('Hello world'); });
// API to register a user
app.post('/register', routes.register);
// API to verify both registration and updating a record.
app.get('/verify', routes.verify);
// API to update a user's record.
app.post('/update', routes.update);

app.listen(port, _ => {
  console.log(`Server is running on http://localhost:${port}`);
});