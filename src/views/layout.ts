import { html } from 'hono/html'
import type { HtmlEscapedString } from 'hono/utils/html'

type Body = HtmlEscapedString | Promise<HtmlEscapedString>

export const layout = (title: string, body: Body) => html`
  <!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, system-ui, sans-serif;
          max-width: 600px;
          margin: 2rem auto;
          padding: 0 1rem;
          color: #222;
          line-height: 1.6;
        }
        h1 { font-size: 1.5rem; }
        form { margin: 1rem 0; }
        input[type="text"] {
          padding: 0.5rem;
          font-size: 1rem;
          width: 70%;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          border: 1px solid #ccc;
          background: #f8f8f8;
          border-radius: 4px;
        }
        button:hover { background: #eee; }
        ul { list-style: none; padding: 0; }
        li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-bottom: 1px solid #eee;
        }
        .done { text-decoration: line-through; color: #999; }
        .inline { display: inline; }
      </style>
    </head>
    <body>
      ${body}
    </body>
  </html>
`
