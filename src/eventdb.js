import fs from 'fs/promises';
import client from './dbclient.js';
import express from "express";
import multer from "multer";
const route = express.Router();
const form = multer();
route.use(express.urlencoded({ extended: true }));
route.use(express.json());
const event = client.db('lab5db').collection('event');

async function getEventDetails(eventId) {
  try {
    // Fetch event details from the database based on eventId
    const eventDetails = await event.findOne({ eventname:eventId });
    return eventDetails;
  } catch (err) {
    console.error('Error fetching event details:', err);
    return null;
  }
}
async function getAllEvents() {
  try {
    const eventsList = await event.find({}).toArray();
    return eventsList;
  } catch (err) {
    console.error('Error fetching event details:', err);
    return null;
  }
}
async function insertEvent(eventname,type, price, image, seatnumber, date, time,  venue, description, BookedSeat) {
  try {
    const result = await event.updateOne(
      {eventname},
      {$set: {type, price, image, seatnumber, date, time,  venue, description, BookedSeat}},
      {upsert:true}
    );
    if (result.upsertedCount === 1) {
      console.log('Added 1 event');
    } else {
      console.log('Added 0 event');
    }
    return true;
  } catch (error) {
    console.error('Unable to update the database:', error);
    return false;
  }
}
async function event_exist(eventname) {
  try {
    const user = await fetch_event(eventname);
    return user !== null;
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return false;
  }
}
async function fetch_event(eventname) {
  try {
    const user = await event.findOne({ eventname: eventname });//username:username
    return user;
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return null;
  }
}
export {getEventDetails,getAllEvents,insertEvent, event_exist,fetch_event};