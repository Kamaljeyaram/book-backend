const BookStore = require('../models/bookStore');
const { v4: uuidv4 } = require('uuid');

const store = new BookStore(process.env.DATA_FILE || './data/books.json');

function validateBookPayload(payload) {
  const { title, author } = payload;
  if (!title || !author) return false;
  return true;
}

exports.listBooks = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);

    let books = await store.getAll();

    if (search) {
      const q = String(search).toLowerCase();
      books = books.filter(b => (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q));
    }

    const total = books.length;
    const start = (pageNum - 1) * limitNum;
    const paged = books.slice(start, start + limitNum);

    res.json({total, page: pageNum, limit: limitNum, data: paged});
  } catch (err) {
    next(err);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const book = await store.getById(req.params.id);
    if (!book) return res.status(404).json({error: 'Book not found'});
    res.json(book);
  } catch (err) {
    next(err);
  }
};



exports.createBook = async (req, res, next) => {
  try {
    const payload = req.body;
    if (!validateBookPayload(payload)) return res.status(400).json({error: 'Missing required fields: title and author'});

    const newBook = {
      id: uuidv4(),
      title: payload.title,
      author: payload.author,
      publishedDate: payload.publishedDate || null,
      description: payload.description || null,
      fileUrl: payload.fileUrl || null,
      createdAt: new Date().toISOString(),
    };

    await store.create(newBook);
    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const existing = await store.getById(id);
    if (!existing) return res.status(404).json({error: 'Book not found'});

    const payload = req.body;
    const updated = Object.assign({}, existing, {
      title: payload.title !== undefined ? payload.title : existing.title,
      author: payload.author !== undefined ? payload.author : existing.author,
      publishedDate: payload.publishedDate !== undefined ? payload.publishedDate : existing.publishedDate,
      description: payload.description !== undefined ? payload.description : existing.description,
      fileUrl: payload.fileUrl !== undefined ? payload.fileUrl : existing.fileUrl,
      updatedAt: new Date().toISOString(),
    });

    await store.update(id, updated);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const existing = await store.getById(id);
    if (!existing) return res.status(404).json({error: 'Book not found'});

    await store.delete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.uploadBook = async (req, res, next) => {
  try {
    const file = req.file;
    const payload = req.body || {};

    if (!file) return res.status(400).json({ error: 'No file uploaded (expected field name "file")' });
    if (!validateBookPayload(payload)) return res.status(400).json({ error: 'Missing required fields: title and author' });

    const newBook = {
      id: uuidv4(),
      title: payload.title,
      author: payload.author,
      publishedDate: payload.publishedDate || null,
      description: payload.description || null,
      fileUrl: file.originalname,
      createdAt: new Date().toISOString(),
    };

    await store.create(newBook);
    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
};
