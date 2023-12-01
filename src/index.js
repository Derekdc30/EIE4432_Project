//<!--20060616d Choy Wing Ho-->
//<!--22019343d Siu Ching Him-->
import express from "express";
import session from "express-session";
import login from "./route.js";
import mongostore from 'connect-mongo';
import client from "./dbclient.js";'/dbclient.js';
import path from 'path';

const app = express();
app.use(
 session({
 secret: 'eie4432_project',
 resave: false,
 saveUninitialized: false,
 cookie: { httpOnly: true },
 store: mongostore.create({
 client,
 dbName: 'lab5db',
 collectionName: 'session',
 }),
 })
);


app.use('/auth', login);
app.use(express.static('static'));
app.use(express.static('assets'));
app.use('/', express.static(path.join(process.cwd(), '/static')));

const PREAUTH_KEY = '<EIE4432>';
app.use((req, res, next) => {
    if (!req.session?.allow_access) {
        if (req.query?.authkey === PREAUTH_KEY) {
            req.session.allow_access = true;
        } else {
            res.status(401).json({
                status: 'failed',
                message: 'Unauthorized'
            });
        }
    }
    next();
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
