const request = require('supertest');
const app = require('../src/app');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.resolve(process.cwd(), 'data/books.test.json');

beforeAll(async () => {
  // ensure test data file exists empty
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, '[]', 'utf8');
  process.env.DATA_FILE = DATA_FILE;
});

afterAll(async () => {
  try { await fs.unlink(DATA_FILE); } catch (e) {}
});

describe('Books API', () => {
  let createdId;

  test('POST /books - create book', async () => {
    const res = await request(app).post('/books').send({title: 'Test', author: 'Me'}).expect(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.title).toBe('Test');
    createdId = res.body.id;
  });

  test('GET /books/:id - fetch created book', async () => {
    const res = await request(app).get(`/books/${createdId}`).expect(200);
    expect(res.body.id).toBe(createdId);
  });

  test('GET /books - list', async () => {
    const res = await request(app).get('/books').expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('PUT /books/:id - update', async () => {
    const res = await request(app).put(`/books/${createdId}`).send({title: 'Updated'}).expect(200);
    expect(res.body.title).toBe('Updated');
  });

  test('DELETE /books/:id - delete', async () => {
    await request(app).delete(`/books/${createdId}`).expect(204);
    await request(app).get(`/books/${createdId}`).expect(404);
  });
});
