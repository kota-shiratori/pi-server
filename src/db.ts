import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

// data/todos.db を WorkingDirectory 基準で作る
// systemd の WorkingDirectory=/home/swan/pi-server なので
// 結果的に /home/swan/pi-server/data/todos.db になる
const DB_PATH = process.env.DB_PATH ?? 'data/todos.db'

mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)

// WAL モード = 読み書き並行可能、SQLite では推奨デフォルト
db.pragma('journal_mode = WAL')

// 起動時にスキーマ作成（CREATE IF NOT EXISTS なので冪等）
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  )
`)

export type Todo = {
  id: number
  title: string
  done: number  // SQLite に boolean 無いので 0/1
  created_at: number
}
