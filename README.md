# Netflix-style Portfolio — Saurabh Singh

A Netflix-inspired personal portfolio. Pick a profile (Recruiter / Developer / Stalker),
each gets its own background video, hero copy and row ordering.

No build step, no dependencies, no npm. Three files do the work:

```
index.html          markup shell
css/style.css       all styling
js/data.js          ← ALL your content lives here. This is the only file you need to edit.
js/app.js           rendering + video logic
assets/resume.pdf   the Resume button target (your CV, already copied in)
assets/video/       local MP4 clips, one per profile (see below)
assets/icons/       profile pictures shown on the "Who's watching?" screen
```

---

## Run it locally

Because the site uses `fetch()` to detect local video files, opening `index.html`
directly with `file://` will throw CORS errors. Serve it instead:

```bash
cd netflix-portfolio
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

In Cursor you can also use the **Live Server** extension — right-click `index.html`
→ *Open with Live Server*.

> The intro animation plays on every load. It is silent by design — there is
> no intro audio. Its length is `INTRO_MS` at the top of `js/app.js`.

---

## Deploy to GitHub Pages (free)

```bash
cd netflix-portfolio
git init
git add .
git commit -m "Netflix-style portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment**
- Source: **Deploy from a branch**
- Branch: **main**, folder: **/ (root)** → Save

Your site goes live at `https://YOUR-USERNAME.github.io/YOUR-REPO/` in ~1 minute.

**Want it at `YOUR-USERNAME.github.io` instead?** Name the repo exactly
`YOUR-USERNAME.github.io` and push to `main` — same steps otherwise.

A `.nojekyll` file is already included so GitHub serves the files as-is.

---

## Before you push — 3 things to fill in

Open `js/data.js` and search for `TODO`:

1. **`links.github`** — currently a placeholder. Set your real GitHub URL.
2. **`projects[].url`** — point each project at its actual repo.
3. **`recommendations`** — empty. Paste real LinkedIn quotes in as
   `{ quote, author, role }` objects. Until you do, the card gracefully
   falls back to showing your strengths instead.

Everything else (summary, experience, skills, certs, education) is already
populated from your CV.

---

## The background videos

Each profile is configured in `js/data.js`:

| Profile   | YouTube ID    | Clip window |
|-----------|---------------|-------------|
| Recruiter | `sqyde2jcLdQ` | 0s – 30s    |
| Developer | `IU-dnL1hJ1Q` | 123s – 153s |
| Stalker   | `A953td1sKS8` | 50s – 80s   |

The video layer resolves in three steps, automatically:

1. **Local MP4** — the file named in that profile's `videoFile` (currently
   `assets/video/<profile>_video.mp4`). Best performance, works offline, no
   YouTube branding. Rename a clip → update `videoFile` in `data.js`, nothing else.
2. **YouTube embed** — otherwise the clip plays via the YouTube IFrame API,
   muted and looping only within the start/end window above.
3. **Poster image** — if the video owner has disabled embedding, it falls back
   to the video's thumbnail with the Netflix gradient over it. Still looks right.

**A note on option 1:** I didn't download the clips for you, and you should think
carefully before doing it yourself. Downloading from YouTube violates its Terms
of Service, and these clips are copyrighted footage — republishing them from a
public GitHub repo makes you the one distributing them. The YouTube embed path
(option 2) is the licensed way to show this content and is what the site uses by
default. If you do want local files, use footage you own or that's properly
licensed (Pexels and Coverr have good free cinematic B-roll).

**Volume** is set globally by `DATA.volume` in `data.js` (currently `0.3`,
matching Netflix's preview level). Any profile can override it with its own
`volume` — Developer is set to `0.12` because that clip is mixed hot.

**All three profiles open with sound** (`startMuted: false` in `data.js`). Set
any of them to `true` to have that profile open muted. The speaker button in the
hero toggles it at any time.

Autoplay-with-audio is blocked by browsers, so each source starts muted (always
permitted) and unmutes the moment playback begins — allowed because picking a
profile was a real user gesture. If a browser still refuses, the speaker icon
re-syncs to the true state instead of lying.

YouTube's title/branding overlay in the top-left of the frame can't be turned
off by any remaining player flag. Rather than cropping the picture, `.scrim-top`
lays a dark gradient over the top 170px of the hero, which masks that strip and
matches the gradient Netflix runs beneath its own nav. The video itself is never
scaled or cropped — it stays a plain 16:9 cover fill.

---

## Customising

**Change the intro name** → `DATA.brand` in `data.js`.
**Change colors** → the `:root` block at the top of `style.css` (`--red`, `--bg`).
**Profile pictures** → `avatarImg` per profile in `data.js`. Square images work
best; they're cropped to fill. If the file is missing the built-in glyph is used
instead, so a broken image can never show.
**Renaming assets** → both `avatarImg` and `videoFile` are plain paths in
`data.js`; that file is the single place either needs changing. Note GitHub Pages
is case-sensitive even though macOS isn't, so match the filename exactly.
**Add a profile** → append to `DATA.profiles`; add a matching `.av-yourid`
gradient in `style.css` and an icon in the `AV_ICON` map in `app.js`.
**Reorder / rename rows** → the `rowsFor()` function in `app.js`.
**Add a new card type** → add an entry to the `VIEWS` object in `app.js`, then
reference its key from a card in `rowsFor()`.

---

Netflix-inspired fan design for a personal portfolio. Not affiliated with,
endorsed by, or connected to Netflix. The Netflix name, brand and visual identity
belong to Netflix, Inc.
