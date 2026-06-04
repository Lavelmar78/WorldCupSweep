# 🏆 World Cup Sweep Tracker

A live World Cup sweep competition tracker with Firebase real-time sync. Players see a live leaderboard — only the admin can add players, run the draw, and enter results.

---

## Setup Guide

### 1. Create a Firebase Project

1. Go to [firebase.google.com](https://firebase.google.com) and sign in with Google
2. Click **Add project** → name it (e.g. `worldcup-sweep`) → click through
3. In the left sidebar go to **Build → Realtime Database**
4. Click **Create Database** → choose a region → start in **test mode** (you can lock it down later)
5. In the left sidebar go to **Project Settings** (gear icon) → scroll down to **Your apps**
6. Click the `</>` (Web) icon → register the app → copy the `firebaseConfig` object — you'll need these values

### 2. Set up the project locally

```bash
git clone https://github.com/YOUR_USERNAME/worldcup-sweep.git
cd worldcup-sweep
npm install
```

### 3. Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase config values and choose an admin password:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123...
VITE_ADMIN_PASSWORD=ChooseAPasswordHere
```

> ⚠️ Never commit `.env` to GitHub. It's already in `.gitignore`.

### 4. Run locally to test

```bash
npm run dev
```

Open [http://localhost:5173/worldcup-sweep/](http://localhost:5173/worldcup-sweep/)

---

## Deploy to GitHub Pages

### 5. Push to GitHub

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### 6. Add secrets to GitHub

In your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

Add each of these secrets (same values as your `.env`):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ADMIN_PASSWORD`

### 7. Enable GitHub Pages

In your repo → **Settings → Pages → Source** → select `gh-pages` branch → Save

After the first push, GitHub Actions will build and deploy automatically. Your site will be live at:

```
https://YOUR_USERNAME.github.io/worldcup-sweep/
```

> Note: If your repo name is different, update `base` in `vite.config.js` to match.

---

## How to use

| Who | What they can do |
|-----|-----------------|
| Everyone | View leaderboard, see team assignments |
| Admin | Add players, run the draw, enter match results |

To access admin: click the **Admin** button in the top right and enter your password.

---

## Points System

| Stage | Win | Draw |
|-------|-----|------|
| Group Stage | 2 pts | 1 pt |
| Round of 16 | 3 pts | — |
| Quarter-Final | 4 pts | — |
| Semi-Final | 5 pts | — |
| Final | 6 pts | — |

Each player is randomly assigned one team from each of 4 seeded pots, so everyone gets a mix of strong and weaker teams.
