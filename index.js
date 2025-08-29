const bodyParser = require('body-parser');
const session = require('express-session');
require("dotenv").config({ quiet: true });
const express = require('express');
const db = require('./configs/db');
const app = express();
const path = require('path');
const router = require('./routers');
const MongoStore = require('connect-mongo');


const port = process.env.port || 8081;
require('dotenv').config();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.use('/', router);

app.listen(port, () => {
    try {
        db;
        console.log("Server Online on http://localhost:" + port);
    } catch (error) {
        console.log("Server not online");
        console.log(error.message);
    }
})