import express from "express";
import session from "express-session";
import login from "./route.js";
import mongostore from 'connect-mongo';
import client from "./dbclient.js";'/dbclient.js';
import {getEventDetails,getAllEvents} from './eventdb.js';
import{ gridFSBucket } from './userdb.js';
import { ObjectId } from 'mongodb';
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
app.get('/api/eventimage/:eventId',async (req, res)=>{
   const eventId = req.params.eventId;
  const event = await getEventDetails(eventId);
  if (event.profileImageId) {
        try {
          // Retrieve the image from GridFS using the profileImageId
          const imageStream = gridFSBucket.openDownloadStream(new ObjectId(event.profileImageId));
          const chunks = [];
          
          imageStream.on('data', (chunk) => {
            chunks.push(chunk);
          });

          imageStream.on('end', () => {
            // Concatenate the chunks into a Buffer
            const buffer = Buffer.concat(chunks);
            // Convert the Buffer to base64
            const base64Image = buffer.toString('base64');

            // Add the base64Image to the user object
            event.profileImage = base64Image;

            // Send the user data with the profileImage field to the client
            res.json({
              status: 'success',
              event,
            });
          });
        } catch (error) {
          console.error('Error fetching image from GridFS:', error);
          res.status(500).json({
            status: 'failed',
            message: 'Error fetching image from GridFS',
          });
        }
      }
});
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
