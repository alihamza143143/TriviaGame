# Deploy Trivia Game to GitHub + Vercel

Follow these steps to push your code correctly and deploy on Vercel.

---

## 1. Push to GitHub (correct folder)

Your **Git repo root** is:  
`c:\Users\ARFA TECH\Downloads\Trivia game`  
The app code is in the **Attached-Assets** subfolder. Always run git from the **repo root** (the parent folder).

### In PowerShell:

```powershell
cd "c:\Users\ARFA TECH\Downloads\Trivia game"

# Check status
git status

# Add all (respects .gitignore)
git add .

# Commit
git commit -m "Fix Vercel deploy: root vercel.json and build:client"

# Push (use 'main' if that's your default branch)
git push origin master
```

If your default branch is `main`:

```powershell
git push origin main
```

### What was fixed in the repo

- **Root `vercel.json`** – Tells Vercel to build the **client only** from the repo root and use `client/dist` as the output. This avoids the “wrong folder” issue.
- **`build:client` script** – Runs `vite build` (your root `vite.config.ts` already uses `client` as the Vite root, so the built app goes to `client/dist`).
- **Root `.gitignore`** – Ignores `node_modules`, `.env`, `dist`, `client/dist`, `.vercel`, etc., so you don’t push secrets or build artifacts.

---

## 2. Deploy on Vercel

### Option A: Import from GitHub (recommended)

1. Go to [vercel.com](https://vercel.com) and sign in (use “Continue with GitHub” if you use GitHub).
2. Click **“Add New…”** → **“Project”**.
3. **Import** the repository that contains this project (the one you just pushed).
4. **Root Directory:** set to **`Attached-Assets`** (the folder that has `package.json` and `vercel.json`).  
   Your repo root is the parent “Trivia game” folder; the app lives in **Attached-Assets**. Do **not** set it to `client` or leave empty.
5. Vercel will read `vercel.json` inside **Attached-Assets** and use:
   - **Build Command:** `npm run build:client`
   - **Output Directory:** `client/dist`
   - **Install Command:** `npm install`
6. Click **Deploy**. Wait for the build to finish.

### Option B: You already have a Vercel project

1. Open your project on [vercel.com](https://vercel.com) → **Settings**.
2. **General → Root Directory:** set to **`Attached-Assets`**.  
   If it was empty, `client`, or something else, change it to **Attached-Assets** and save.
3. **Build & Development Settings** (optional):  
   If you prefer to set them in the UI instead of `vercel.json`:
   - **Build Command:** `npm run build:client`
   - **Output Directory:** `client/dist`
   - **Install Command:** `npm install`
4. Go to **Deployments**, open the **⋮** on the latest deployment, and click **Redeploy** (or push a new commit to trigger a new deploy).

---

## 3. Check the deployment

- After the build succeeds, Vercel will show a URL like `https://your-project-xxx.vercel.app`.
- Open it; you should see your Trivia game (frontend only; no server/API on Vercel unless you add a serverless API later).

---

## Quick checklist

| Step | Action |
|------|--------|
| 1 | `cd` into **Trivia game** (repo root, parent of Attached-Assets). |
| 2 | `git add .` and `git commit` and `git push` from that folder. |
| 3 | On Vercel, **Root Directory** = **Attached-Assets**. |
| 4 | Deploy; build uses `npm run build:client` and output `client/dist`. |

If something fails, check the **Build Logs** on Vercel for the exact error message.
