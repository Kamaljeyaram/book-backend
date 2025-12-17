const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const booksRouter = require('./routes/books');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
// Serve static files (e.g., PDFs) from uploads directory using absolute path
const path = require('path');
const uploadsDir = path.resolve(process.cwd(), 'uploads');
// Serve static files for direct downloads
app.use('/uploads', express.static(uploadsDir));

// List files in uploads directory as a simple HTML page with clickable links
app.get('/uploads', async (req, res, next) => {
  try {
    const fs = require('fs').promises;
    const files = await fs.readdir(uploadsDir);
    const links = files.map(f => `<li><a href="/uploads/${f}" download>${f}</a></li>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Uploads</title></head><body><h1>Uploads</h1><ul>${links}</ul></body></html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    next(err);
  }
});

app.get('/health', (req, res) => res.json({status: 'ok'}));

app.use('/books', booksRouter);

// 404
app.use((req, res) => res.status(404).json({error: 'Not Found'}));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({error: err.message || 'Internal Server Error'});
});

module.exports = app;
