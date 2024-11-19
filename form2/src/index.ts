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

// Validation schema
const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  contentType: z.string().min(1, "コンテントタイプを入力してください"),
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

// Create todo
app.post('/api/todos', async (req, res) => {
  try {
    const validatedData = todoSchema.parse(req.body);
console.log(req.body);
    const todo = await prisma.todo.create({
      data: {
        ...validatedData,
        datePublish: validatedData.datePublish ? new Date(validatedData.datePublish) : null,
        dateUpdate: validatedData.dateUpdate ? new Date(validatedData.dateUpdate) : null,
      }
    });
    res.json(todo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  const { search } = req.query;
  try {
    const todos = await prisma.todo.findMany({
      where: search ? {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const validatedData = todoSchema.parse(req.body);
    const todo = await prisma.todo.update({
      where: { id: Number(id) },
      data: {
        ...validatedData,
        datePublish: validatedData.datePublish ? new Date(validatedData.datePublish) : null,
        dateUpdate: validatedData.dateUpdate ? new Date(validatedData.dateUpdate) : null,
      }
    });
    res.json(todo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.todo.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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
  