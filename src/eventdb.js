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
export {getEventDetails,getAllEvents};