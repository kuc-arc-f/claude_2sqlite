//import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { int, sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  content_type: text('content_type').notNull(),
  public: integer('public').notNull(), // 1: public, 0: private
  food_orange: integer('food_orange', { mode: 'boolean' }).notNull().default(0), // 1: checked, 0: unchecked
  food_apple: integer('food_apple', { mode: 'boolean' }).notNull().default(0),
  food_banana: integer('food_banana', { mode: 'boolean' }).notNull().default(0),
  food_melon: integer('food_melon', { mode: 'boolean' }).notNull().default(0),
  food_grape: integer('food_grape', { mode: 'boolean' }).notNull().default(0),
  pub_date1: text('pub_date1'),
  pub_date2: text('pub_date2'),
  pub_date3: text('pub_date3'),
  pub_date4: text('pub_date4'),
  pub_date5: text('pub_date5'),
  pub_date6: text('pub_date6'),
  qty1: text('qty1'),
  qty2: text('qty2'),
  qty3: text('qty3'),
  qty4: text('qty4'),
  qty5: text('qty5'),
  qty6: text('qty6'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});