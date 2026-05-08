import { html } from 'hono/html'
import type { Todo } from '../db.js'
import { layout } from './layout.js'

export const todoList = (todos: Todo[]) => {
  const body = html`
    <h1>📝 Todo</h1>

    <form method="post" action="/todos">
      <input type="text" name="title" placeholder="新しいタスク" required autofocus />
      <button type="submit">追加</button>
    </form>

    ${todos.length === 0
      ? html`<p>まだタスクはありません</p>`
      : html`
          <ul>
            ${todos.map(
              (t) => html`
                <li>
                  <form method="post" action="/todos/${t.id}/toggle" class="inline">
                    <button type="submit">${t.done ? '↩️' : '✅'}</button>
                  </form>
                  <span class="${t.done ? 'done' : ''}">${t.title}</span>
                  <form method="post" action="/todos/${t.id}/delete" class="inline" style="margin-left:auto">
                    <button type="submit">🗑️</button>
                  </form>
                </li>
              `
            )}
          </ul>
        `}
  `
  return layout('Pi Todo', body)
}
