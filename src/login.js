import express from "express";
import multer from "multer";
import fs from 'fs/promises';
import {
  validate_user,
  update_user,
  fetch_user,
  username_exist
} from './userdb.js';

const route = express.Router();
const form = multer();
route.use(express.urlencoded({ extended: true }));
route.use(express.json());

route.post('/login',form.none(), async (req, res)=>{
  req.session.logged = false;
  const username = req.body.username;
  const password = req.body.password;
  
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

export default route;