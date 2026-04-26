# Deployment Guide: FloodSense AI + DrainIQ

This project consists of a React Vite frontend and a Python Flask backend. Here are the instructions to deploy the application to production platforms like Render, Netlify, and GitHub.

## 1. GitHub Setup (Version Control)

Before deploying, ensure both your frontend and backend are pushed to a single GitHub repository (monorepo structure) or two separate repositories.

```bash
git init
git add .
git commit -m "Initial Commit: FloodSense AI Award-Winning Edition"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 2. Backend Deployment (Render.com)

Render is ideal for hosting Python Flask applications.

1. Create an account on [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. **Configuration Details:**
   - **Name:** floodsense-api (or similar)
   - **Root Directory:** `backend` (if using a monorepo)
   - **Environment:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app` (You will need to add `gunicorn` to your `requirements.txt`)
5. **Environment Variables:**
   - If using real Firebase/Gemini keys in the future, add them under the **Environment** tab in Render.
6. Click **Create Web Service**. Render will build and provide you with a live URL (e.g., `https://floodsense-api.onrender.com`).

*Important: Update the `API_BASE` in your `frontend/src/App.jsx` to point to this new Render URL instead of `http://localhost:5000/api`.*

## 3. Frontend Deployment (Netlify)

Netlify is excellent for deploying React Vite applications.

1. Go to [Netlify.com](https://www.netlify.com/) and log in.
2. Click **Add new site** -> **Import an existing project**.
3. Connect your GitHub account and select your repository.
4. **Configuration Details:**
   - **Base directory:** `frontend` (if using a monorepo)
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Click **Deploy site**.

### Handling React Router on Netlify
Since this is a Single Page Application (SPA), you need to tell Netlify to redirect all traffic to `index.html`. 
Create a file named `_redirects` inside `frontend/public/` with the following content:
```
/* /index.html 200
```

## 4. Frontend Deployment (Vercel - Alternative)

If you prefer Vercel over Netlify for the React app:
1. Go to [Vercel.com](https://vercel.com/) and import your project.
2. Set the Root Directory to `frontend`.
3. Vercel automatically detects Vite and configures the build settings.
4. Click **Deploy**.

## Final Steps
Once both are deployed, test the live Frontend URL. Ensure it successfully communicates with the live Backend URL and that CORS policies (handled in `app.py`) permit traffic from your Netlify/Vercel domain.
