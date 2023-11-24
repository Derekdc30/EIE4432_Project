import express from "express";
import session from "express-session";
import login from "./route.js";
import mongostore from 'connect-mongo';
import client from "./dbclient.js";'/dbclient.js';
import {getEventDetails,getAllEvents} from './eventdb.js';
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

app.get('/api/events/:eventId', async (req, res) => {
  const eventId = req.params.eventId;
  // Retrieve event details from the database based on eventId
  const eventDetails = await getEventDetails(eventId);
  res.json(eventDetails);
});

app.get('/api/events', async (req, res) => {
  try {
    // Retrieve a list of all events from the database
    const eventsList = await getAllEvents();
    res.json(eventsList);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
