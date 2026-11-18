# UW Student Portal – Vulnerable Starter Project (CYS-331L Lab 06)

This is a deliberately vulnerable **static training application** built with HTML, CSS and JavaScript. It uses fake data only.

## Files
- `index.html` – portal page
- `app.js` – demo logic and intentionally insecure patterns
- `style.css` – page styling
- `semgrep-rules.yml` – educational Semgrep rules
- `.github/workflows/security-scan.yml` – GitHub Actions security scan

## Upload to your own GitHub repository
1. Create a new GitHub repository.
2. Upload the contents of this folder (not an extra enclosing folder if you want `index.html` at the repository root).
3. Commit and push the files to the `main` branch.

Or use Git:
```bash
git init
git add .
git commit -m "Upload vulnerable UW portal"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Enable GitHub Pages
1. Open your repository → Settings → Pages.
2. Select **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`.
4. Save and wait for deployment.
5. Open the URL shown in the Pages settings.

## Demo account
- Email: `ayesha@uw.test`
- Password: `ayesha123`

## Student tasks
1. Deploy your own copy.
2. Identify and document at least six security weaknesses using browser DevTools and source inspection.
3. Run the supplied Semgrep rules and save a before report:
```bash
python -m pip install semgrep
semgrep scan --config semgrep-rules.yml --exclude instructor . --json -o semgrep_before.json
```
4. Fix the assigned insecure patterns without simply deleting required functionality.
5. Push your changes, wait for Pages to redeploy, repeat your tests and save an after report:
```bash
semgrep scan --config semgrep-rules.yml --exclude instructor . --json -o semgrep_after.json
```

## Safety and architecture notes
- Test only your own repository and your own Pages website.
- All records and credentials in this project are fake. Never add real student data, passwords, CNICs, API keys or tokens.
- Do not test the University of Wah website, another student's site or any third-party system.
- GitHub Pages is static hosting. It cannot provide genuine server-side authentication, authorization, database protection, rate limiting or secret storage.
- Client-side checks are demonstrations only. In your report, identify which issues can be mitigated in the browser and which require a backend in a real application.
- The Semgrep rules detect only selected patterns. A clean scan does not prove that the application is fully secure.
