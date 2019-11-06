require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');
const helmet = require('helmet');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet)

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => console.log(`Connected to MongDB on ${db.host}:${db.port}...`));
db.on('error', err => console.log(`💩DB error:\n${err}`));

app.use('/auth', require('./routes/auth'));
app.use('/locked', expressJWT({ secret: process.env.JWT_SECRET }).unless({ method: 'POST' }), require('./routes/locked')) //Unless allows ppl to add data without being authenticated

app.listen(process.env.PORT, ()=>console.log(`🎧☕️You're listening to the smooth sounds of port ${process.env.PORT} ☕️🎧`))