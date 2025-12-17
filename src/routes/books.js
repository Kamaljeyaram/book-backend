const express = require('express');
const router = express.Router();
const controller = require('../controllers/booksController');
const upload = require('../middleware/upload');

router.get('/', controller.listBooks);
router.get('/:id', controller.getBook);
router.post('/', controller.createBook);
// Helper page: simple HTML form to upload a PDF
router.get('/upload', (req, res) => {
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.send(`<!doctype html>
	<html><head><meta charset="utf-8"><title>Upload Book</title></head>
	<body>
		<h1>Upload Book (PDF)</h1>
		<form action="/books/upload" method="post" enctype="multipart/form-data">
			<div><label>Title: <input name="title" required></label></div>
			<div><label>Author: <input name="author" required></label></div>
			<div><label>Published Date: <input name="publishedDate" placeholder="YYYY-MM-DD"></label></div>
			<div><label>Description: <input name="description"></label></div>
			<div><label>PDF File: <input type="file" name="file" accept="application/pdf" required></label></div>
			<button type="submit">Upload</button>
		</form>
	</body></html>`);
});
router.post('/upload', upload.single('file'), controller.uploadBook);
router.put('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);

module.exports = router;

