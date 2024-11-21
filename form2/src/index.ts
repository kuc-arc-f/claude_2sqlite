import fs from 'node:fs/promises'
import express from "express";
const { PrismaClient } = require('@prisma/client');
import { z } from 'zod';


import { renderToString } from 'react-dom/server';
import cookieParser from "cookie-parser";
import session from "express-session";

import Top from './pages/App';
import About from './pages/about';
//
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
console.log("env= ", process.env.NODE_ENV);
//

// Validation schema
export const PostSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  contentType: z.string().min(1, "コンテンツタイプを入力してください"),
  age: z.string().optional(),
  public: z.boolean(),
  foodOrange: z.boolean(),
  foodApple: z.boolean(),
  foodBanana: z.boolean(),
  foodMelon: z.boolean(),
  foodGrape: z.boolean(),
  datePublish: z.string().optional().nullable(),
  dateUpdate: z.string().optional().nullable(),
  postNumber: z.string().optional(),
  addressCountry: z.string().optional(),
  addressPref: z.string().optional(),
  addressCity: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  textOption1: z.string().optional(),
  textOption2: z.string().optional(),
});

export type PostInput = z.infer<typeof PostSchema>;

// 全件取得
app.get('/api/posts', async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    
    if (search) {
      whereClause = {
        OR: [
          { title: { contains: String(search) } },
          { content: { contains: String(search) } },
        ],
      };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    //console.log(posts);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'データの取得に失敗しました' });
  }
});

// 投稿の作成
app.post('/api/posts', async (req, res) => {
  try {
    const validatedData = PostSchema.parse(req.body);
    
    const post = await prisma.post.create({
      data: {
        ...validatedData,
        datePublish: validatedData.datePublish ? new Date(validatedData.datePublish) : null,
        dateUpdate: validatedData.dateUpdate ? new Date(validatedData.dateUpdate) : null,
      },
    });
    
    res.json(post);
  } catch (error) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: '投稿の作成に失敗しました' });
    }
  }
});

// 投稿の更新
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = PostSchema.parse(req.body);
    
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...validatedData,
        datePublish: validatedData.datePublish ? new Date(validatedData.datePublish) : null,
        dateUpdate: validatedData.dateUpdate ? new Date(validatedData.dateUpdate) : null,
      },
    });
    
    res.json(post);
  } catch (error) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: '投稿の更新に失敗しました' });
    }
  }
});

// 投稿の削除
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json({ message: '投稿を削除しました' });
  } catch (error) {
    res.status(500).json({ error: '投稿の削除に失敗しました' });
  }
});
// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});
//
const errorObj = {ret: "NG", messase: "Error"};

app.get("/*", (req, res) => {
  res.send(renderToString(Top()));
});
//start
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
  