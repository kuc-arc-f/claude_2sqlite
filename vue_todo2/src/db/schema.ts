//import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { int, sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  public: integer('public', { mode: 'boolean' }).notNull().default(0),
  food_orange: integer('food_orange', { mode: 'boolean' }).notNull().default(0),
  food_apple: integer('food_apple', { mode: 'boolean' }).notNull().default(0),
  food_banana: integer('food_banana', { mode: 'boolean' }).notNull().default(0),
  pub_date: text('pub_date').notNull(),
  qty1: text('qty1').notNull(),
  qty2: text('qty2').notNull(),
  qty3: text('qty3').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});