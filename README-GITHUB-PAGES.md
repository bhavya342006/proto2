# CivicShield — GitHub Pages deployment

## Important: upload the project files, not only this ZIP

1. Download and extract this ZIP on your computer.
2. Open your GitHub repository and choose **Add file → Upload files**.
3. Open the extracted `civicshield_work` folder (the folder containing `package.json`). Select and upload its **contents**: `index.html`, `src/`, `package.json`, `vite.config.ts`, `.github/`, `.nojekyll`, and the other project files. Do not upload just the ZIP, and do not place all files inside an extra nested project folder.
4. Commit to the `main` branch.
5. Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
6. Open **Actions**, select the latest **Deploy CivicShield to GitHub Pages** run, and wait for both `build` and `deploy` to succeed.
7. Open the Pages URL shown in the deploy job. For a repository named `civicshield`, it is normally `https://YOUR-USERNAME.github.io/civicshield/`.

The Vite config detects the repository name in GitHub Actions and sets the correct asset base automatically for a project site. Local development uses `/`.

## Notes
- A public GitHub Pages site cannot safely keep a private API key in frontend code. Any Gemini API key should be kept on a secure backend, not committed to this repository.
- This workflow builds the Vite app into `dist/` and deploys that output; GitHub Pages should not be configured to serve the raw source folder.
