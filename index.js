/* 
 * Upstack Application
 */

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const helper = require('./libs/helpers');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => {
    res.send('Hello world');
});

// API to register a user
app.post('/register', (req, res) => {
    const user = new User();
    const email = typeof(req.body.email) == 'string' && req.body.email.trim().length > 0 ? req.body.email.trim() : false;
    const username = typeof(req.body.username) == 'string' && req.body.username.trim().length > 2 ? req.body.username.trim() : false;
    user.username = username;
    user.email = email;
    user.verificationId = helper.createRandomString(10);
    if (username && email) {
        user.save((err, data) => {
            if (!err) {
                // Send verification link
                const html = `<b>Hello ${username}</b><br>Please verify you want to update your email with the link:
                 http://localhost:9000/verify?username=${username}&id=${data.verificationId}&action=verify`;
                helper.sendEmailUsingNodemail(data.email, 'Upstack Challenge', 'Verify Registration', html);
                res.json({ 'msg': 'User saved successfully. Please check your mail to verify.' });
            } else {
                res.json({ 'msg': 'There was a problem creating user.', 'error': err });
            }
        });
    } else {
        res.json({ 'error': 'Some fields are missing' });
    }
});

// API to verify both registration and updating a record.
app.get('/verify', (req, res) => {
    const verificationId = typeof(req.query.id) == 'string' && req.query.id.trim().length === 10 ? req.query.id.trim() : false;
    const username = typeof(req.query.username) == 'string' && req.query.username.trim().length > 2 ? req.query.username.trim() : false;
    const email = typeof(req.query.email) == 'string' && req.query.email.trim().length > 2 ? req.query.email.trim() : false;
    const action = typeof(req.query.action) == 'string' && ['update', 'verify'].indexOf(req.query.action) > -1 ? req.query.action.trim() : false;

    if (action === 'verify') {
        if (username && verificationId) {
            User.findOne({ username: username, verificationId: verificationId }, (err, data) => {
                if (!err && data) {
                    data.isVerified = true;
                    // Update the users record
                    User.update({ _id: data._id }, data, (err) => {
                        if (!err) {
                            res.json({ 'statusCode': 200, 'msg': 'You are now a verified user.' });
                        } else {
                            res.json({ 'error': err, 'msg': 'There was an error updating user.' });
                        }
                    });
                } else {
                    res.json({ 'error': err, 'msg': 'You are not register. Please register.' });
                }
            });
        } else {
            res.json({ 'error': 'The link is either broken or some fields are missing' });
        }
    } else if (action === 'update') {
        if (username && email) {
            User.findOne({ username: username }, (err, data) => {
                if (!err && data) {
                    data.email = email;
                    // Update the users record
                    User.update({ _id: data._id }, data, (err) => {
                        if (!err) {
                            res.json({ 'statusCode': 200, 'msg': 'Your account has been updated successfully.' });
                        } else {
                            res.json({ 'error': err, 'msg': 'There was an error updating user.' });
                        }
                    });
                } else {
                    res.json({ 'error': err, 'msg': 'You are not register. Please register.' });
                }
            });
        } else {
            res.json({ 'error': 'Some fields are missing' });
        }
    }
});

// API to update a user's record.
app.post('/update', (req, res) => {
    const email = typeof(req.body.email) == 'string' && req.body.email.trim().length > 0 ? req.body.email.trim() : false;
    const username = typeof(req.body.username) == 'string' && req.body.username.trim().length > 2 ? req.body.username.trim() : false;

    if (username && email) {
        const html = `<b>Hello ${username}</b><br>Please verify you want to update your email with the link:
        http://localhost:9000/verify?username=${username}&email=${email}&action=update`;
        helper.sendEmailUsingSendGrid(email, 'Upstack Challenge', 'Update Verification', html).then(emailRes => {
            res.json({ 'msg': 'Please check your mail to verify this update' });
        }).catch(err => {});
    } else {
        res.json({ 'error': 'Some fields are missing' });
    }
});

app.listen(port, _ => {
    console.log(`Server is running on http://localhost:${port}`);
});