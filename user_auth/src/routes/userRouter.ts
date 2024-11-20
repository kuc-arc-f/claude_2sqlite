import express from 'express';
const router = express.Router();
import axios from 'axios';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
/**
* 
* @param
*
* @return
*/ 
router.post('/login', async function(req: any, res: any) {
  const retObj = {ret: 500, message: ""};
  try {
    if(!req.body){
      throw new Error("nothing, body");
    }
    const body = req.body;
console.log(req.body);
    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });  
    // ユーザーが存在しない場合
    if (!user) {
      return res.status(401).json({
          error: 'メールアドレスまたはパスワードが正しくありません。'
      });
    }
    console.log(user);
    console.log("id=", user.id);
    const isMatch = await Bun.password.verify(body.password, user.password);
    console.log("isMatch=", isMatch);
    //return res.json(retObj)
    if(isMatch) {
      console.log("OK");
      const key = process.env.APP_NAME + "_auth"
      res.cookie(key, user.id);
      retObj.ret = 200;
      return res.json(retObj)
    }
    retObj.ret = 400;
    return res.json(retObj)
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
* 
* @param
*
* @return
*/ 
router.post('/logout', async function(req: any, res: any) {
  const retObj = {ret: 500, message: ""};
  try {
//console.log("AUTH_PASSWORD= ", process.env.AUTH_PASSWORD);
    retObj.ret = 200;
    const key = process.env.APP_NAME + "_auth"
    res.clearCookie(key);
    return res.json(retObj)
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
export default router;
