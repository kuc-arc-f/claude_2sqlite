import fs from 'node:fs/promises'
import express from "express";
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

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

// 全てのブックマークを取得
app.get('/api/bookmarks', async (req, res) => {
  const { search } = req.query;
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: search ? {
        OR: [
          { title: { contains: search } },
          { url: { contains: search } }
        ]
      } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// ブックマークを作成
app.post('/api/bookmarks', async (req, res) => {
  const { title, url } = req.body;
  try {
    const bookmark = await prisma.bookmark.create({
      data: { title, url }
    });
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

// ブックマークを更新
app.put('/api/bookmarks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;
  try {
    const bookmark = await prisma.bookmark.update({
      where: { id: parseInt(id) },
      data: { title, url }
    });
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// ブックマークを削除
app.delete('/api/bookmarks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.bookmark.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bookmark' });
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
  