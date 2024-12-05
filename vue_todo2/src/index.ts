
import express from 'express';
import { renderToString } from 'vue/server-renderer'
import { createSSRApp } from 'vue'
const app = express();
import 'dotenv/config'
import { eq, like } from 'drizzle-orm';
import { todos } from './db/schema'; 
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DB_FILE_NAME!);


//
import App from './pages/App.vue'
//
import commonRouter from './routes/commonRouter';
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
console.log("env=", process.env.NODE_ENV)
//console.log("EXTERNAL_API_URL=", process.env.EXTERNAL_API_URL)
//
const errorObj = {ret: "NG", messase: "Error"};
// route
app.use('/api/common', commonRouter);
//

// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const todo = await db.insert(todos).values({
      title: req.body.title,
      content: req.body.content,
      public: req.body.public,
      food_orange: req.body.food_orange,
      food_apple: req.body.food_apple,
      food_banana: req.body.food_banana,
      pub_date: req.body.pub_date,
      qty1: req.body.qty1,
      qty2: req.body.qty2,
      qty3: req.body.qty3,
    }).returning();
    res.json(todo[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const { search } = req.query;
    let query = db.select().from(todos);
    
    if (search) {
      query = query.where(like(todos.title, `%${search}%`));
    }
    
    const allTodos = await query;
    res.json(allTodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await db.select().from(todos).where(eq(todos.id, parseInt(req.params.id)));
    if (todo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = await db.update(todos)
      .set({
        title: req.body.title,
        content: req.body.content,
        public: req.body.public,
        food_orange: req.body.food_orange,
        food_apple: req.body.food_apple,
        food_banana: req.body.food_banana,
        pub_date: req.body.pub_date,
        qty1: req.body.qty1,
        qty2: req.body.qty2,
        qty3: req.body.qty3,
      })
      .where(eq(todos.id, parseInt(req.params.id)))
      .returning();
    
    if (todo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await db.delete(todos)
      .where(eq(todos.id, parseInt(req.params.id)))
      .returning();
    
    if (todo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//routes
app.get('/*', async (req: any, res: any) => {
  const app = createSSRApp(App)
  const html = await renderToString(app, {})
  try { res.send(html); } catch (error) { res.sendStatus(500); }
});

//start
const PORT = 3000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
console.log('start');
