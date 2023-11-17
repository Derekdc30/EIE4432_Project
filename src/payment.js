import express from "express";
import multer from "multer";

const route = express.Router();
const form = multer();
route.use(express.urlencoded({ extended: true }));
route.use(express.json());

route.post('/pay/visa',form.none(), async (req, res)=>{
  
});
route.post('/pay/paypal',form.none(), async (req, res)=>{
  
});
route.post('/pay/AE',form.none(), async (req, res)=>{
  
});

