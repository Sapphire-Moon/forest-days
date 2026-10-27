# 🌳 Forest Days

A cozy, Ghibli-inspired day planner game. Plan your day, let Totoro remind you,
visit an animated little world with ASMR sounds while you do each task, and
earn acorns to decorate your own world.

## How it plays

| Tab | What happens |
|---|---|
| 🗓️ **My Day** | Plant tasks (study, college, cooking, eating, shower, shopping, commute, exercise, cleaning, reading, sleep, free time) with a start time and length. A "sample day" button fills in an example. |
| 🌳 **Adventure** | Press ▶ Start on a task and step into a living Ghibli-style painting with your character and Totoro: the autumn gorge railway for college, the rainy lantern path for commuting, the treehouse for studying and reading, the forest shrine steps for exercise and free time, hydrangea street for shopping, and the cottage for home tasks (it turns to night with fireflies at bedtime). Rain, light rays, drifting petals, chimney smoke and matching ASMR sounds play while a timer counts down to the deadline. |
| 🍳 **Cooking game** | During a cooking task: pick a Ghibli-inspired recipe (picnic onigiri, Ponyo's ham ramen, Howl's castle breakfast, Kiki's pumpkin & herring pie, miso soup, tea-time cookies), gather the groceries from Totoro's pantry, then chop, stir, crack, shape, time the flip/oven and serve. Dishes go into a cookbook. |
| 🧺 **Market game** | During a shopping task: find everything on a shopping list at the village market. |
| 🧒 **Characters** | Play as Chihiro, Kiki, Mei, Satsuki, Sophie, Ponyo, Arrietty, Nausicaä, San, Haku, Howl or Pazu (tap your face in the top bar to switch). |
| 🏡 **My World** | Spend acorns in the forest shop (sunflowers, soot sprites, lanterns, a cottage, a floating castle…) and drag them around your own world. |
| 📔 **Journal** | Perfect-day streak, on-time %, a weekly chart, time spent per activity, a daily mood and diary, and a "memory lane" of past days. |

**Rules**
- 🔔 Totoro reminds you 5 minutes before a task, when it starts, and 5 minutes before the deadline (with a chime, plus an optional desktop notification).
- 🌰 Finishing **on time** earns acorns (bigger tasks earn more). Finishing every task on time (3 or more) earns a +15 **Perfect Day** bonus.
- 🍂 If a deadline is **missed**, the forest shop rests for the rest of that day, so no new items can be unlocked. The task can still be finished (without acorns), and missed tasks can't be deleted to cheat 😉.

All sounds are generated live in the browser (Web Audio API), and all art is drawn in SVG, so the app has no build step, no audio files and no server.
Data is saved in the browser's localStorage. Use **⚙️ Settings → Backup my data** to move it to another device.

> Reminders only fire while the page is open in a browser tab (it can be in the background). Keep it pinned in a tab during the day.

## Run it locally

Any static file server works. The app uses ES modules, so opening `index.html` directly from disk won't work.

```bash
python -m http.server 5173
```

Then open http://localhost:5173

## Put it on GitHub

1. Create a new **empty** repository on https://github.com/new (for example `forest-days`). Don't add a README there.
2. In this folder, run:

```bash
git remote add origin https://github.com/YOUR-USERNAME/forest-days.git
git branch -M main
git push -u origin main
```

## Deploy on Vercel (easiest)

1. Go to https://vercel.com/new and sign in with GitHub.
2. Import the `forest-days` repository.
3. Framework preset: **Other**. Leave the build command and output directory empty.
4. Click **Deploy**. You'll get a URL like `forest-days.vercel.app`.

Every `git push` redeploys automatically.

## Or deploy on Render

1. Go to https://dashboard.render.com → **New** → **Blueprint**, and pick the repository. Render reads `render.yaml` and creates a free static site.
   (Or choose **New → Static Site**, set Build Command to empty and Publish Directory to `.`.)
2. Click **Apply / Create**. You'll get a URL like `forest-days.onrender.com`.

## Project layout

```
index.html        page structure
css/style.css     styles and all scene animations
js/app.js         planner, reminders, rewards, shop, journal
js/art.js         SVG art: Totoro, activities, garden items
js/avatars.js     the 12 chibi character avatars
js/scenes.js      painted scenes + animated layers (rain, rays, petals…)
js/kitchen.js     cooking game and market game
assets/scenes/    the six background paintings
js/audio.js       procedural ASMR ambience + music box
js/store.js       saving to localStorage
render.yaml       Render static-site config
```

## A note on characters and paintings

Totoro and the other characters belong to Studio Ghibli. The drawings here are
simple fan art made for personal use. The scene paintings in `assets/scenes/`
were collected from the internet and belong to their original artists (one
carries a rednote watermark). Before sharing the app widely or publicly, swap
the paintings for ones you have the rights to (same file names, portrait 9:16),
and consider renaming and redrawing the characters.
