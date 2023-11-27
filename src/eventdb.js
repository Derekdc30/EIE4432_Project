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

async function getEventDetails(eventId) { // this function is to get a event detail
  try {
    // Fetch event details from the database based on eventId
    const eventDetails = await event.findOne({ eventname:eventId });
    return eventDetails;
  } catch (err) {
    console.error('Error fetching event details:', err);
    return null;
  }
}
async function getAllEvents() { // this function is to get all event at database
  try {
    const eventsList = await event.find({}).toArray();
    return eventsList;
  } catch (err) {
    console.error('Error fetching event details:', err);
    return null;
  }
}
async function insertEvent(eventname,type, price, image, seatnumber, date, time,  venue, description, BookedSeat) { // this function is to add new event to database
  try {
    const result = await event.updateOne(
      {eventname},
      {$set: {type, price, seatnumber, date, time,  venue, description, BookedSeat}},
      {upsert:true}
    );
    if (result.upsertedCount === 1) {
      console.log('Added 1 event');
    } else {
      console.log('Added 0 event');
    }
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
    const user = await getEventDetails(eventname);
    return user !== null;
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return false;
  }
}
async function fetch_event(eventname) { // this function is to get 
  try {
    const user = await event.findOne({ eventname: eventname });//username:username
    return user;
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return null;
  }
}
export {getEventDetails,getAllEvents,insertEvent, event_exist,fetch_event};