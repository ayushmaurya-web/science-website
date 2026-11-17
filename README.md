# UP Board Class 10 Science – Study Website

Plain HTML5 + CSS3 + vanilla JavaScript. No framework, no build step, no GitHub API, no keys.

## Folder structure

```
Science-Website/
├── index.html
├── style.css
├── script.js
├── README.md
├── google-apps-script/Code.gs
├── content/chapter-1 … chapter-13/   notes.pdf  mindmap.pdf  book.pdf
├── pyq/                              2022.pdf … 2026.pdf
└── model-paper/                      model-paper.pdf
```

Every folder already exists (kept by `.gitkeep`). The file names above are fixed – do not rename them.

## 1. Adding PDFs (no code editing)

Fixed paths (13 chapters x 3 files = 39, plus 5 PYQ and 1 model paper = 45 in total):

```
content/chapter-1/notes.pdf    content/chapter-1/mindmap.pdf    content/chapter-1/book.pdf
... same three names in chapter-2 to chapter-13 ...
pyq/2022.pdf  pyq/2023.pdf  pyq/2024.pdf  pyq/2025.pdf  pyq/2026.pdf
model-paper/model-paper.pdf
```


1. Put `notes.pdf`, `mindmap.pdf` and `book.pdf` into `content/chapter-N/`.
2. Put `2022.pdf` … `2026.pdf` into `pyq/`.
3. Put `model-paper.pdf` into `model-paper/`.
4. Run the site locally (section 2) and refresh the page.

You never edit HTML, CSS or JavaScript for a normal PDF. The check (`checkPdf()` in `script.js`) runs on every page load/refresh. A file counts as a PDF only if the server answers 200/206 **and** the file really starts with `%PDF-`. Empty files, renamed non-PDF files, 404 pages and network errors all stay disabled. Test PDFs must be real PDFs.

All buttons are already on the site. When the page loads it checks every fixed path; found PDFs switch their **View** and **Download** buttons on, missing ones stay disabled with the label **PDF Not Available**.

File names must match exactly, in lowercase (`notes.pdf`, not `Notes.PDF`) – GitHub Pages and Vercel are case-sensitive.

## 2. Running locally

PDF detection uses HTTP requests, so the site must be served by a local server. Opening `index.html` by double-click (`file://`) does not work for detection: browsers restrict HTTP requests from `file://` pages, so every PDF would look missing, and the site will show a notice saying so.

**VS Code Live Server:** install the “Live Server” extension, open the `Science-Website` folder, click **Go Live**, open `http://127.0.0.1:5500/` (make sure the project root is the served folder).

**Python:** in the project folder run `python -m http.server 8000`, then open `http://localhost:8000/`.

## 3. YouTube videos

Open `script.js` and paste links inside the quotes at the top:

```js
const chapterVideos = {1:"https://youtu.be/XXXXXXXXXXX", 2:"", 3:"", ... 13:""};
```

Standard (`youtube.com/watch?v=`), `youtu.be`, `/shorts/` and `/embed/` links work. An empty value shows a disabled **Video Not Added** button. This is the only place you edit code, and only for videos.

## 4. Publishing the live site

Adding a PDF to the folder on your computer does **not** put it on the live website. New PDFs do **not** appear on an already-published site by themselves. After adding files locally, publish the updated project again.

**GitHub Pages**
1. Create a repository and upload the whole project (or `git add . && git commit && git push`).
2. Repository → Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.
3. Open the URL GitHub shows. Repeat the push whenever you add PDFs.
Note: GitHub has a 100 MB per-file limit.

**Vercel**
1. Push the project to GitHub, then Vercel → *Add New → Project* → import the repository.
2. Framework preset: **Other**. Leave build command and output directory empty. Deploy.
3. Every later push redeploys automatically with the new PDFs.

## 5. Contact form (Google Apps Script, one-time setup)

1. Go to https://script.google.com and create a new project.
2. Replace its contents with `google-apps-script/Code.gs`, save.
3. *Deploy → New deployment → type: Web app*. Execute as: **Me**. Who has access: **Anyone**. Deploy and approve the permission prompts (Gmail send permission).
4. Copy the Web App URL (starts with `https://script.google.com/macros/s/…/exec`).
5. In `script.js`, replace `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with that URL.
6. After editing `Code.gs` later you must create a **new deployment version** for changes to take effect.

Messages go to `ayushmaurya.education@gmail.com`. Send a test message from the live site and confirm it arrives (check Spam too) before relying on it.


## Fixed PDF paths

Place chapter PDFs in `content/chapter-1/` through `content/chapter-13/` using the names `notes.pdf`, `mindmap.pdf`, and `book.pdf`. Place previous-year papers at `pyq/2022.pdf` through `pyq/2026.pdf`, and the model paper at `model-paper/model-paper.pdf`. Buttons remain visible even when a file has not been added yet.

## YouTube video links

The YouTube video feature is already included. Open `script.js` and add each chapter's YouTube URL in the `chapterVideos` object at the top. The entries are intentionally blank until you provide your own video links.

## Opening the website

Open `index.html` directly to browse the website. PDF links use fixed relative paths; depending on browser and local-file restrictions, viewing/downloading local PDFs may work more reliably when served from a local web server. A missing PDF will show a file-not-found page when its link is clicked.
