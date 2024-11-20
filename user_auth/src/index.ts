import fs from 'node:fs/promises'
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

import { renderToString } from 'react-dom/server';
import cookieParser from "cookie-parser";
import session from "express-session";

import Common from './lib/Common';
import Top from './pages/App';
import About from './pages/about';
//
import userRouter from './routes/userRouter';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
console.log("env= ", process.env.NODE_ENV);
console.log("AUTH_EXPIRED_TIME= ", process.env.AUTH_EXPIRED_TIME);
//
app.use('/api/user', userRouter);
// Session
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * Number(process.env.AUTH_EXPIRED_TIME),  // クッキーの有効期限をn-minに設定(msec * sec * min)
    //httpsを使用しない
    secure: false
  }
}));
const errorObj = {ret: "NG", messase: "Error"};
//middleware
app.use(async function(req: any, res: any, next: any){
  const valid = await Common.validUser(req, res);
  if(!valid) {
    console.log("nothing, user-session");
    res.redirect('/login');
  } else {
    next();
  }
});

// ユーザー作成エンドポイント
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // パスワードのハッシュ化
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4, // number between 4-31
    });

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // パスワードを除外してレスポンスを返す
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    // メールアドレスの重複エラーをチェック
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'このメールアドレスは既に使用されています。' });
    }
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
});
// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});
//

app.get("/*", (req, res) => {
  res.send(renderToString(Top()));
});
//start
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
  