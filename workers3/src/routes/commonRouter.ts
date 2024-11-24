import express from 'express';
const router = express.Router();
//require('dotenv').config();
import axios from 'axios';
import todoData from './todoData';

/**
* 
* @param
*
* @return
*/ 
router.post('/send_post', async function(req: any, res: any) {
  const retObj = {ret: 500 , message: "" }
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
    const body = req.body;
    //console.log(body);
    const url = process.env.EXTERNAL_API_URL; 
    const path = body.external_path;	
console.log("path=", url + path);
    const response = await axios.post(url + path, body, 
    {headers: { 'Content-Type': 'application/json'}
    });
    //console.log(response.data);
    retObj.ret = 200;
    retObj.data = response.data.data;
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
router.post('/get_sys_items', async function(req: any, res: any) {
  const retObj = {ret: 500 , message: "" }
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
    const body = req.body;
    //console.log(body);
    retObj.ret = 200;
    retObj.data = { api_url: process.env.EXTERNAL_API_URL};
    return res.json(retObj);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
