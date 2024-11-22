import fs from 'node:fs/promises'
import express from "express";
import { z } from 'zod';
import { eq, like } from 'drizzle-orm';
import { db } from './db';
import { todos } from './db/schema';

import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DB_FILE_NAME!);

import { renderToString } from 'react-dom/server';
import cookieParser from "cookie-parser";
import session from "express-session";

import Top from './pages/App';
import About from './pages/about';
//
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
console.log("env= ", process.env.NODE_ENV);
//

const TodoSchema = z.object({
  content: z.string().min(1, { message: "Todo content cannot be empty" }),
});

// Create TODO
app.post('/api/todos', async (req, res) => {
  try {
    const { content } = TodoSchema.parse(req.body);
    const result = await db.insert(todos).values({ content }).returning();
    res.json(result[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Read TODOs
app.get('/api/todos', async (req, res) => {
  const { search } = req.query;
  try {
    let query = db.select().from(todos);
    if (search) {
      query = query.where(like(todos.content, `%${search}%`));
    }
    const result = await query.all();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update TODO
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { content } = TodoSchema.parse(req.body);
    const result = await db
      .update(todos)
      .set({ content })
      .where(eq(todos.id, parseInt(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Delete TODO
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await db.delete(todos).where(eq(todos.id, parseInt(req.params.id)));
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
  