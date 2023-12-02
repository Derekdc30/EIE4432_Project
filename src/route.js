//<!--20060616d Choy Wing Ho-->
//<!--22019343d Siu Ching Him-->
import express from "express";
import multer from "multer";
import { ObjectId } from 'mongodb';
import {
  users,
  validate_user,
  update_user,
  fetch_user,
  username_exist,
  update_event,
  update_token,
  validate_token,
  forgotPassword,
  gridFSBucket,
  update_transaction,
  fetch_transaction,
  all_transaction,
  transaction,
  modify_user,
  event
} from './userdb.js';
import { 
  insertEvent,
  event_exist,
  fetch_event,
  getAllEvents,
  delete_event
} from "./eventdb.js";

const route = express.Router();
const form = multer();

route.use(express.urlencoded({ extended: true }));
route.use(express.json());


route.post('/login', form.none(), async (req, res) => {
  req.session.logged = false;
  const username = req.body.username;
  const password = req.body.password;
  const rememberMe = req.body.rememberMe;

  const user = await validate_user(username, password);
  if (user) {
    req.session.logged = true;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.timestamp = Date.now();
    if (rememberMe) {
      const token = req.body.token || generateToken();
      res.cookie('remember_me', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    update_token(username, token, password);
  }
    res.json({
      status: 'success',
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Incorrect username and password',
    });
  }
});
route.post('/logout',form.none(),(req, res)=>{
  if(!req.body.timeout){
    res.clearCookie('remember_me');
  }
  if(req.session.logged){
    req.session.destroy();
    res.end();
  }
  else{
    res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
      });
  }
});
route.get('/me', form.none(), async (req, res) => {
  if (req.session.logged) {
    const user = await fetch_user(req.session.username);

    if (user) {
      // Check if the user has a profile image ID
      if (user.profileImageId) {
        try {
          // Retrieve the image from GridFS using the profileImageId
          const imageStream = gridFSBucket.openDownloadStream(new ObjectId(user.profileImageId)); // Fix: use 'new'
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
            user.profileImage = base64Image;

            // Send the user data with the profileImage field to the client
            res.json({
              status: 'success',
              user,
            });
          });
        } catch (error) {
          console.error('Error fetching image from GridFS:', error);
          res.status(500).json({
            status: 'failed',
            message: 'Error fetching image from GridFS',
          });
        }
      } else {
        // If the user does not have a profile image, send the user data without the image
        res.json({
          status: 'success',
          user,
        });
      }
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});
route.post('/register', form.single('profileImage'), async (req, res) => {
  if(!req.body.username || !req.body.password){
    return res.status(400).json({
      status:'failed',
      message:'Missing fields',
    });
  }
  if(req.body.username.length < 3){
    return res.status(400).json({
      status:'failed',
      message:'Username must be at least 3 characters',
    });
  }
  if(await username_exist(req.body.username)){
    return res.status(400).json({
      status:'failed',
      message:`Username ${req.body.username} already exist`,
    });
  }
  if(req.body.password.length<8){
    return res.status(400).json({
      status:'failed',
      message:'Password must be at least 8 characters',
    });
  }

  if(await update_user(req.body.username,req.body.password,req.body.nickname, req.body.gender, req.body.birthday,req.file,generateuid())){
    return res.status(400).json({
      status:'success',
      user:{
        username:req.body.username,
      }
    });
  }
  else{
    return res.status(500).json({
      status: 'failed',
      message:'Account created but unable to save into the database',
    });
  }
});
route.post('/pay/visa', form.none(),async (req, res) => {
  if (!req.body.Master_Card_No || !req.body.Month || !req.body.Year || !req.body.Master_Cardholder || !req.body.Master_Security) {
    return res.status(500).json({
      status: 'failed',
      message: 'Missing fields',
    });
  }
  await update_event(req.body.eventname,req.body.seatarr);
  var currentDate = new Date();
  currentDate = currentDate.getFullYear()+"/"+currentDate.getMonth()+"/"+currentDate.getDate()+" "+currentDate.getHours()+":"+currentDate.getMinutes();
  await update_transaction(req.body.username,currentDate,req.body.eventname,req.body.price,req.body.booked);
  return res.status(400).json({
    status: 'success',
    message: 'Payment successful',
    event : {
      eventname: req.body.eventname,
      seat : req.body.seatarr,
    }
  });
  
});
route.post('/pay/paypal',form.none(), async (req, res)=>{
  if(!req.body.Paypal_email){
    return res.status(500).json({
      status: 'failed',
      message: 'Missing fields',
      event : {
      eventname: req.body.eventname,
      seat : req.body.seatarr,
    }
    });
  }
  await update_event(req.body.eventname,req.body.seatarr);
  var currentDate = new Date();
  currentDate = currentDate.getFullYear()+"/"+currentDate.getMonth()+"/"+currentDate.getDate()+" "+currentDate.getHours()+":"+currentDate.getMinutes();
  await update_transaction(req.body.username,currentDate,req.body.eventname,req.body.price,req.body.booked);
  return res.status(400).json({
    status: 'success',
    message: 'Payment successful',
    event : {
      eventname: req.body.eventname,
      seat : req.body.seatarr,
    }
  });
});
route.post('/pay/AE',form.none(), async (req, res)=>{
  if (!req.body.AE_Cardholder || !req.body.Month || !req.body.Year || !req.body.AE_Card_No || !req.body.AE_Security) {
    return res.status(500).json({
      status: 'failed',
      message: 'Missing fields',
    });
  }
  await update_event(req.body.eventname,req.body.seatarr);
  var currentDate = new Date();
  currentDate = currentDate.getFullYear()+"/"+currentDate.getMonth()+"/"+currentDate.getDate()+" "+currentDate.getHours()+":"+currentDate.getMinutes();
  await update_transaction(req.body.username,currentDate,req.body.eventname,req.body.price,req.body.booked);
  return res.status(400).json({
    status: 'success',
    message: 'Payment successful',
  });
});
route.post('/newevents', form.single('eventImage'), async (req, res) => {
  if(await event_exist(req.body.eventname))
  {
    return res.status(400).json({
      status:'failed',
      message:'Event exist',
    });
  }
  if(await insertEvent(req.body.eventname, req.body.eventType, req.body.price, req.file, parseInt(req.body.eventSeatNumber,10), req.body.eventDate, req.body.eventTime, req.body.eventVenue, req.body.eventDescription,generateuid())){
    return res.status(400).json({
      status:'success',
      event:{
        eventname:req.body.event,
      }
    });
  }
  else{
    return res.status(500).json({
      status: 'failed',
      message:'Event created but unable to save into the database',
    });
  }

});
route.post('/loginwithtoken', form.none(), async (req, res) => {
  const token = req.body.token;
  const user = await validate_token(token);
  
  if (user) {
    req.session.logged = true;
    req.session.username = user.username;
    res.json({
      status: 'success',
      user: {
        username: user.username,
      },
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Invalid token',
    });
  }
});
const generateToken = () => {
  const tokenLength = 32;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
};
const generateuid = () => {
  const tokenLength = 16;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
};
route.post('/forgot',form.none(), async (req, res)=>{
  if(await forgotPassword(req.body.userID, req.body.birthday, req.body.nickname, req.body.newPassword)){
    res.status(500).json({
        status: 'success',
        message: 'password is reset',
      });
  }
  else{
    res.status(401).json({
        status: 'success',
        message: 'error at resetting password',
      });
  }
});
route.post('/updateinfo',form.single('profileImage'), async (req, res)=>{
  if(await modify_user(req.body.username,req.body.password,req.body.nickname, req.body.gender, req.body.birthday,req.file,req.body.uid)){
    return res.status(400).json({
      status:'success',
      user:{
        username:req.body.username,
      }
    });
  }
  else{
    return res.status(500).json({
      status: 'failed',
      message:'Account created but unable to save into the database',
    });
  }
});
route.get('/transactionHistory', form.none(), async (req, res) => {
  if (req.session.logged) {
    try {
      const transactions = await fetch_transaction(req.session.username);
      if (transactions && transactions.length > 0) {
        res.json({
          status: 'success',
          transactions: transactions,
        });
      } else {
        res.json({
          status: 'success',
          message: 'No transactions found for the user.',
        });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({
        status: 'failed',
        message: 'Error fetching transactions from the database',
      });
    }
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});
route.get('/api/events/:eventId', async (req, res) => {
  const eventId = req.params.eventId;
  // Retrieve event details from the database based on eventId
  const eventDetails = await fetch_event(eventId);
  res.json(eventDetails);
});
route.get('/api/events', async (req, res) => {
  try {
    // Retrieve a list of all events from the database
    const eventsList = await getAllEvents();
    res.json(eventsList);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
route.get('/api/eventimage/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await fetch_event(eventId);

    // Check if event is not null and has a profileImageId
    if (event && event.profileImageId !== null && event.profileImageId !== undefined) {
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

          // Add the base64Image to the event object
          event.profileImage = base64Image;

          // Send the event data with the profileImage field to the client
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
    } else {
      // If event is null or does not have a profileImageId, send an error response
      res.status(404).json({
        status: 'failed',
        message: 'Event not found or does not have a profileImageId',
      });
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Error fetching event from the database',
    });
  }
});
route.post('/api/updateevent/:eventId', form.single('eventImage'), async (req, res) => {
  const eventId = req.params.eventId;
  // Fetch existing event details
  const existingEvent = await fetch_event(eventId);

  if (!existingEvent) {
    return res.status(404).json({
      status: 'failed',
      message: 'Event not found',
    });
  }

  // Update event details
  const updatedEventData = {
    eventType: req.body.eventType,
    price: req.body.price,
    seat: req.body.eventSeatNumber,
    eventDate: req.body.eventDate,
    eventTime: req.body.eventTime,
    eventVenue: req.body.eventVenue,
    eventDescription: req.body.eventDescription,
    bookedSeat: existingEvent.BookedSeat,
  };
  console.log("booked: " +updatedEventData.bookedSeat);
  // Update the event details in the database
  const updateResult = await insertEvent(req.body.eventname, updatedEventData.eventType,updatedEventData.price,req.file,updatedEventData.seat,updatedEventData.eventDate,updatedEventData.eventTime,updatedEventData.eventVenue,updatedEventData.eventDescription,existingEvent.uid);

  if (updateResult) {
    return res.status(200).json({
      status: 'success',
      message: 'Event details updated successfully',
    });
  } else {
    return res.status(500).json({
      status: 'failed',
      message: 'Error updating event details',
    });
  }
});
route.get('/api/alltransactionhistory', form.none(), async (req, res) => {
  try {
    const transactions = await all_transaction();
     if (transactions && transactions.length > 0) {
        res.json({
          status: 'success',
          transaction: transactions,
        });
      } else {
        res.json({
          status: 'success',
          message: 'No transactions found for the user.',
        });
      }
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
route.get('/api/userbookedseat/:eventId',form.none(), async(req,res) =>{
    const eventId = req.params.eventId;
  try {
    const transactions = await transaction.find({eventname:eventId}).toArray();
    res.json(transactions);
  } catch (err) {
    console.error('Unable to fetch transactions from the database:', err);
    return null;
  }
});
route.get('/api/allAccount', form.none(), async (req, res) => {
  try {
    const accounts = await users.find({}).toArray();

    // Use Promise.all to wait for all image processing to complete
    const accountsWithImages = await Promise.all(
      accounts.map(async (user) => {
        if (user.profileImageId) {
          try {
            // Retrieve the image from GridFS using the profileImageId
            const imageStream = gridFSBucket.openDownloadStream(new ObjectId(user.profileImageId));
            const chunks = [];

            // Use a promise to wait for the stream to end
            await new Promise((resolve, reject) => {
              imageStream.on('data', (chunk) => {
                chunks.push(chunk);
              });

              imageStream.on('end', () => {
                resolve();
              });

              imageStream.on('error', (error) => {
                reject(error);
              });
            });

            // Concatenate the chunks into a Buffer
            const buffer = Buffer.concat(chunks);
            // Convert the Buffer to base64
            const base64Image = buffer.toString('base64');

            // Add the base64Image to the user object
            user.profileImage = base64Image;

            // Return the user with the profileImage field
            return user;
          } catch (error) {
            console.error('Error fetching image from GridFS:', error);
            throw new Error('Error fetching image from GridFS');
          }
        } else {
          // If the user does not have a profile image, return the user without the image
          return user;
        }
      })
    );

    return res.json({
      status: 'success',
      accounts: accountsWithImages,
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Error fetching accounts from the database',
    });
  }
});
route.post('/api/cancelEvent/:eventId',form.none(), async(req,res)=>{
  const eventId = req.params.eventId;
  try {
    const event = await fetch_event(eventId);
    const deleteevent = await delete_event(eventId);
    if(deleteevent){
      await transaction.updateMany({eventname:event.eventname},{$set:{cancel:true}});
      return res.json({
      status: 'success',
    });
    }
  } catch (err) {
    console.error('Unable to fetch transactions from the database:', err);
    return null;
  }
});
export default route;