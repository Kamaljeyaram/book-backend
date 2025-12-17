const fs = require('fs').promises;
const path = require('path');

class BookStore {
  constructor(filePath) {
    this.filePath = path.resolve(filePath || './data/books.json');
    this._initPromise = null;
  }

  async _ensureFile() {
    if (!this._initPromise) {
      this._initPromise = (async () => {
        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
        try {
          await fs.access(this.filePath);
        } catch (e) {
          // create with empty array
          await fs.writeFile(this.filePath, '[]', 'utf8');
        }
      })();
    }
    return this._initPromise;
  }

  async _read() {
    await this._ensureFile();
    const raw = await fs.readFile(this.filePath, 'utf8');
    try {
      return JSON.parse(raw || '[]');
    } catch (e) {
      // corrupt file -> overwrite
      await fs.writeFile(this.filePath, '[]', 'utf8');
      return [];
    }
  }

  async _write(data) {
    await this._ensureFile();
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll() {
    return await this._read();
  }

  async getById(id) {
    const items = await this._read();
    return items.find(i => i.id === id) || null;
  }

  async create(item) {
    const items = await this._read();
    items.push(item);
    await this._write(items);
    return item;
  }

  async update(id, newItem) {
    const items = await this._read();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = newItem;
    await this._write(items);
    return newItem;
  }

  async delete(id) {
    let items = await this._read();
    const before = items.length;
    items = items.filter(i => i.id !== id);
    if (items.length === before) return false;
    await this._write(items);
    return true;
  }
}

module.exports = BookStore;
