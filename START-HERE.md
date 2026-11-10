# Vellum website: start here

This folder is the complete Vellum website: two pages (**Home** and the **Project journal**), the editor the studio uses to change projects and logos, and a ready-made copy of the site you can open straight away.

| You want to | Do this |
| --- | --- |
| Just look at the site | **Option 1** below (nothing to install, or only Node) |
| Run the real project, with the editor | **Option 2** below (needs Node 22.23 or newer) |
| Hand it to an AI assistant or developer | Point them at **`AGENTS.md`** |

---

## Option 1: look at the site

The `preview` folder is the finished site, already built.

**Quickest:** double-click `preview/index.html`. It opens in your browser and works offline.

**On localhost** (the way a web server would show it):

1. Open **Terminal** (Mac: Spotlight, type Terminal) or **PowerShell** (Windows: Start menu, type PowerShell).
2. Go into this folder. Type `cd ` (with a space), drag this folder onto the window, press Enter.
3. Start the server with whichever of these works on your computer:

   If you have Node (any recent version):

   ```bash
   node scripts/serve.mjs preview
   ```

   If you have Python instead (Mac usually does):

   ```bash
   cd preview && python3 -m http.server 4322
   ```

   On Windows with Python, use `py -m http.server 4322` inside the `preview` folder.

4. Open **http://localhost:4322** in your browser. The Project journal is at **http://localhost:4322/project/**
5. To stop: press **Ctrl + C** in Terminal.

---

## Option 2: run the full project (with the editor)

**Once:** install **Node 22.23 or newer** from https://nodejs.org (choose the LTS version). Check it:

```bash
node -v
```

Then, in Terminal, inside this folder:

```bash
npm install
```

```bash
npm run dev -- --open
```

Your browser opens the site. Leave Terminal open while you use it:

- Home: **http://localhost:4321**
- Project journal: **http://localhost:4321/project/**
- Editor (add, reorder and hide projects, images and logos): **http://localhost:4321/keystatic**

Edits made in the editor change the files in this folder; the site updates as you save. To stop: **Ctrl + C**.

Other commands, all run inside this folder:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the production site into `.vercel/output/static` |
| `npm run preview` | Serves that build at http://localhost:4322 (run `npm run build` first) |
| `npm run offline` | After a build, writes `offline/vellum-site/`, a copy that opens by double-clicking |
| `npm run check` | Checks the code for errors |

---

## Animations not showing?

The site turns animations off when the computer is set to **reduce motion** (an accessibility setting). To see them anyway, add `?motion=on` to the address, for example **http://localhost:4321/?motion=on**

Or turn the setting off: Mac: System Settings, Accessibility, Display, **Reduce motion** off. Windows: Settings, Accessibility, Visual effects, **Animation effects** on.

## What does not work locally

- The **enquiry form** answers that it is not connected yet. It sends real email once the site is on Vercel with a Resend key (see `README.md`).
- The **editor on the live site** signs in with GitHub; locally it needs no sign-in.

## Still placeholder

Collaborator logos, project summaries and most captions, email addresses, studio address and Instagram link are placeholders. Photos are 1024px renders standing in for full-resolution originals. See "Before launch" in `AGENTS.md`.

## More

- `EDITING.md`: the studio's guide to the editor, in plain language.
- `README.md`: developer setup and deploying to Vercel.
- `AGENTS.md`: everything about how the site is built and why, for AI assistants and developers.
