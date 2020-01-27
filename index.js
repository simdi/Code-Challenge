/* 
 * Upstack Application
 */

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const swaggerDoc = require('./swagger.json');
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

const swaggerSpec = swaggerJSDoc(swaggerDoc);
const swaggerOptions = { explorer: true };
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => { res.send('Hello world'); });
// API to register a user
/**
 * @swagger
 *
 * /register:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
app.post('/register', routes.register);
// API to verify both registration and updating a record.
/**
 * @swagger
 * 
 * /users:
 *  get:
 *     description: Returns users
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */
app.get('/verify', routes.verify);
// API to update a user's record.
app.post('/update', routes.update);

app.listen(port, _ => {
  console.log(`Server is running on http://localhost:${port}`);
});