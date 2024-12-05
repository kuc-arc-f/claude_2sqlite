
import express from 'express';
import { renderToString } from 'vue/server-renderer'
import { createSSRApp } from 'vue'
const app = express();
import 'dotenv/config'
import { eq, like } from 'drizzle-orm';
//import { db } from './db';
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

// TODOの全件取得 (検索機能付き)
app.get('/api/todos', async (req, res) => {
  try {
    const { search } = req.query;
    let query = db.select().from(todos);
    
    if (search) {
      query = query.where(
        like(todos.title, `%${search}%`)
      );
    }
    
    const allTodos = await query.all();
    res.json(allTodos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// TODOの個別取得
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await db
      .select()
      .from(todos)
      .where(eq(todos.id, parseInt(id)))
      .get();
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// TODOの作成
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const newTodo = await db
      .insert(todos)
      .values({
        title,
        description,
        completed: false,
      })
      .returning()
      .get();
    
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// TODOの更新
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    const updatedTodo = await db
      .update(todos)
      .set({
        title,
        description,
        completed,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(todos.id, parseInt(id)))
      .returning()
      .get();
    
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// TODOの削除
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db
      .delete(todos)
      .where(eq(todos.id, parseInt(id)))
      .run();
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
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
