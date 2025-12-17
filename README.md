# Book Backend (Node + Express)

A small REST API to store and fetch books for a mobile app. Uses file-based persistence by default (data/books.json).

Quick start

1. Install dependencies

```powershell
npm install
```

2. Start server in dev mode (auto-reloads):

```powershell
npm run dev
```

3. Start production server:

```powershell
npm start
```

API endpoints

- GET /health -> health check
- GET /books -> list books (supports `search`, `page`, `limit` query params)
- GET /books/:id -> fetch single book
- POST /books -> add book (body: title, author, publishedDate, description)
- POST /books/upload -> upload a PDF and create a book (multipart/form-data: file, title, author, [publishedDate], [description])
- PUT /books/:id -> update book
- DELETE /books/:id -> delete book

Notes

- The API persists to `data/books.json`. The file is created automatically if missing.
- For production, consider replacing file-based store with a proper DB (SQLite, Postgres, MongoDB).
- PDFs or other large assets: place them under `uploads/` (ignored by git).
	- Visit `http://localhost:4000/uploads` to see a clickable list; clicking a filename downloads it.
	- Direct file path: `http://localhost:4000/uploads/<filename>` also downloads the file.

Upload a new book (PowerShell examples)

- Upload with a filename without spaces:

```powershell
curl -X POST http://localhost:4000/books/upload `
	-F "file=@uploads\\Math-2025.pdf" `
	-F "title=Math 2025" `
	-F "author=Dept"
```

- Upload with a filename that has spaces (quote the path):

```powershell
curl -X POST http://localhost:4000/books/upload `
	-F "file=@\"uploads\\Biology 2025.pdf\"" `
	-F "title=Biology 2025" `
	-F "author=Dept"
```

The response will include `fileUrl` set to the uploaded filename. You can then download via:
- Clickable list: `http://localhost:4000/uploads`
- Direct path: `http://localhost:4000/uploads/<filename>`
