import express from "express";
import session from "express-session";
import login from "./login.js";
import mongostore from 'connect-mongo';
import client from "./dbclient.js";'/dbclient.js';
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

//app.get('/',(req,res)=>{});
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
