import fs from 'fs/promises';
import client from './dbclient.js';
import express from "express";
import multer from "multer";
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';
const route = express.Router();
const form = multer();
route.use(express.urlencoded({ extended: true }));
route.use(express.json());
const event = client.db('lab5db').collection('event');
const gridFSBucket = new GridFSBucket(client.db('lab5db'));

async function getAllEvents() { // this function is to get all event at database
  try {
    const eventsList = await event.find({}).toArray();
    return eventsList;
  } catch (err) {
    console.error('Error fetching event details:', err);
    return null;
  }
}
async function insertEvent(eventname, type, price, image, seatnumber, date, time, venue, description, BookedSeat, uid) {
  try {
    console.log("booked: "+BookedSeat);
    // Check if the event already exists
    const existingEvent = await fetch_event(uid);

    if (existingEvent) {
      // If the event exists, remove the older event
      await event.deleteOne({ eventname: eventname });
      console.log('Removed older event:', existingEvent.eventname);
    }

    // Insert the new event
    const result = await event.updateOne(
      { eventname: eventname },
      {
        $set: {
          type: type,
          price: price,
          seatnumber: seatnumber,
          date: date,
          time: time,
          venue: venue,
          description: description,
          BookedSeat: BookedSeat,
          uid: uid,
        },
      },
      { upsert: true }
    );

    if (result.upsertedCount === 1) {
      console.log('Added 1 event');
    } else {
      console.log('Added 0 event');
    }

    // Upload image if provided
    if (image) {
      const readableStream = Readable.from(image.buffer);
      const uploadStream = gridFSBucket.openUploadStream(eventname);
      readableStream.pipe(uploadStream);
      const fileId = uploadStream.id;
      await event.updateOne({ eventname }, { $set: { profileImageId: fileId } });
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database:', error);
    return false;
  }
}

async function event_exist(eventname) { // this function is to check event exist or not
  try {
    const user = await event.findOne({ eventname:eventname });
    return user !== null;
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return false;
  }
}
async function fetch_event(uid) { // this function is to get 
  try {
    const eventdetail = await event.findOne({ uid:uid });//username:username
    return eventdetail;
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return null;
  }
}
export {getAllEvents,insertEvent, event_exist,fetch_event};