import express from "express";
import multer from "multer";
import fs from 'fs/promises';
import {
  validate_user,
  update_user,
  fetch_user,
  username_exist,
  update_event
} from './userdb.js';
import { 
  insertEvent,
  event_exist,
  fetch_event 
} from "./eventdb.js";

const route = express.Router();
const form = multer();
route.use(express.urlencoded({ extended: true }));
route.use(express.json());

route.post('/login',form.none(), async (req, res)=>{
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
route.get('/me',form.none(), async (req, res)=>{
  if (req.session.logged) {
    const user = await fetch_user(req.session.username);
      res.json({
        status: 'success',
        user: {
          username: user.username,
          role :user.role,
        },
      });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});
route.post('/register',form.none(),async (req, res)=>{
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
  if(await update_user(req.body.username,req.body.password,req.body.nickname, req.body.gender, req.body.birthday)){
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
  return res.status(400).json({
    status: 'success',
    message: 'Payment successful',
  });
});
route.post('/newevents', form.none(), async (req, res) => {
  if(await event_exist(req.body.eventname))
  {
    return res.status(400).json({
      status:'failed',
      message:'Event exist',
    });
  }
  if(await insertEvent(req.body.eventname, req.body.eventType, req.body.price, req.body.eventImage, parseInt(req.body.eventSeatNumber,10), req.body.eventDate, req.body.eventTime, req.body.eventVenue, req.body.eventDescription, req.body.BookedSeat)){
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

export default route;