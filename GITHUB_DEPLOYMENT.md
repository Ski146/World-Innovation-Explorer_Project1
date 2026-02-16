# 🚀 GitHub Deployment Guide

Your local git repository is initialized and ready to push to GitHub!

## Step-by-Step Instructions

### Step 1: Create Repository on GitHub

1. Go to **https://github.com/new**
2. Fill in the form:
   - **Repository name**: `World-Innovation-Explorer_Project1`
   - **Description**: "Interactive data visualization exploring internet adoption and space technology innovation"
   - **Visibility**: Choose "Public" (so it can be graded)
   - **Do NOT initialize** with README, .gitignore, or license (you already have these)
3. Click **"Create repository"**

### Step 2: Connect Local Repo to GitHub

Copy and paste these commands into PowerShell (replace YOUR_USERNAME):

```powershell
cd "c:\Users\sijus\Downloads\world-innovation-explorer"

git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/World-Innovation-Explorer_Project1.git

git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

### Step 3: Enter Your GitHub Credentials

When prompted:
- **Username**: Your GitHub username
- **Password**: Your GitHub personal access token (PAT)

#### If you don't have a PAT:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Copy the token and paste it when prompted for password

### Step 4: Verify Success

Visit: `https://github.com/YOUR_USERNAME/World-Innovation-Explorer_Project1`

You should see all your project files!

---

## ✅ Checklist

- [ ] Created repository on GitHub.com
- [ ] Replaced YOUR_USERNAME in the commands
- [ ] Ran the git remote add command
- [ ] Ran git push successfully
- [ ] Verified files are on GitHub

---

## Future Commits

After any changes, use:

```powershell
git add .
git commit -m "Your meaningful commit message"
git push
```

---

## Need Help?

Check the status of your remote:
```powershell
git remote -v
```

View your commit history:
```powershell
git log --oneline
```
