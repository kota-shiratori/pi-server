import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from './db.js'
import type { Todo } from './db.js'
import { todoList } from './views/todoList.js'

const app = new Hono()

// GET / : Todo一覧表示
app.get('/', (c) => {
  const todos = db
    .prepare('SELECT * FROM todos ORDER BY done ASC, created_at DESC')
    .all() as Todo[]
  return c.html(todoList(todos))
})

// POST /todos : 新規追加
app.post('/todos', async (c) => {
  const body = await c.req.parseBody()
  const title = String(body.title ?? '').trim()
  if (title.length > 0 && title.length <= 200) {
    db.prepare('INSERT INTO todos (title) VALUES (?)').run(title)
  }
  return c.redirect('/', 303)
})

// POST /todos/:id/toggle : 完了状態切り替え
app.post('/todos/:id/toggle', (c) => {
  const id = Number(c.req.param('id'))
  if (Number.isInteger(id)) {
    db.prepare('UPDATE todos SET done = 1 - done WHERE id = ?').run(id)
  }
  return c.redirect('/', 303)
})

// POST /todos/:id/delete : 削除
app.post('/todos/:id/delete', (c) => {
  const id = Number(c.req.param('id'))
  if (Number.isInteger(id)) {
    db.prepare('DELETE FROM todos WHERE id = ?').run(id)
  }
  return c.redirect('/', 303)
})

const port = Number(process.env.PORT ?? 3000)
serve({ fetch: app.fetch, port })
console.log(`Server is running on http://localhost:${port}`)
