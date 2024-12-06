
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

// Create a new TODO
app.post('/api/todos', async (req, res) => {
  try {
    const now = new Date().toISOString();
    const todo = {
      ...req.body,
      created_at: now,
      updated_at: now,
      // Convert checkbox values to integers
      food_orange: req.body.food_orange ? 1 : 0,
      food_apple: req.body.food_apple ? 1 : 0,
      food_banana: req.body.food_banana ? 1 : 0,
      food_melon: req.body.food_melon ? 1 : 0,
      food_grape: req.body.food_grape ? 1 : 0,
      // Convert public radio to integer
      public: parseInt(req.body.public),
    };

    const result = await db.insert(todos).values(todo).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all TODOs with search
app.get('/api/todos', async (req, res) => {
  try {
    const { search } = req.query;
    let query = db.select().from(todos);
    
    if (search) {
      query = query.where(like(todos.title, `%${search}%`));
    }
    
    //const result = await query.orderBy(todos.created_at.desc);
    const result = await query.all();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single TODO
app.get('/api/todos/:id', async (req, res) => {
  try {
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.id, parseInt(req.params.id)));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a TODO
app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = {
      ...req.body,
      updated_at: new Date().toISOString(),
      // Convert checkbox values to integers
      food_orange: req.body.food_orange ? 1 : 0,
      food_apple: req.body.food_apple ? 1 : 0,
      food_banana: req.body.food_banana ? 1 : 0,
      food_melon: req.body.food_melon ? 1 : 0,
      food_grape: req.body.food_grape ? 1 : 0,
      // Convert public radio to integer
      public: parseInt(req.body.public),
    };

    const result = await db
      .update(todos)
      .set(todo)
      .where(eq(todos.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a TODO
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const result = await db
      .delete(todos)
      .where(eq(todos.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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
