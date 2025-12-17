# Book Backend - Render Deployment

This Node.js + Express backend is ready for deployment on Render.

## Quick Render Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial book backend"
   git branch -M main
   git remote add origin https://github.com/yourusername/book-backend.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Render will auto-detect the `render.yaml` config

3. **Configuration** (auto-detected from render.yaml)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Plan**: Free tier

## Environment Variables (optional)

In Render dashboard, you can set:
- `PORT` (auto-set by Render)
- `DATA_FILE` (defaults to `./data/books.json`)

## API Endpoints (after deployment)

Replace `your-app-name` with your actual Render app name:

- **Health check**: `https://your-app-name.onrender.com/health`
- **List books**: `https://your-app-name.onrender.com/books`
- **Upload page**: `https://your-app-name.onrender.com/books/upload`
- **Download files**: `https://your-app-name.onrender.com/uploads`

## Local Development

```bash
npm install
npm run dev  # or npm start
```

Visit: http://localhost:4000/books/upload

## Features

- ✅ File uploads (PDF)
- ✅ Book CRUD operations
- ✅ Clickable download interface
- ✅ JSON API for mobile apps
- ✅ Browser-friendly upload form