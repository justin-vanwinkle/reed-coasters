# 🎢 Reed's Roller Coaster Dashboard

Interactive data visualizations of 29 roller coasters across 9 parks.

**Live stats:** 325 ft max height · 95 mph top speed · 5.0 G-forces · 86,000 ft of track · 44 inversions

Built with React + Recharts + Vite.

---

## Deploy to Vercel

### Option A: One-command deploy (fastest)

```bash
npm install
npx vercel
```

Follow the prompts — Vercel auto-detects Vite and handles everything.

### Option B: Git → Vercel (auto-deploys on push)

1. Push this project to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Vercel auto-detects Vite — just click **Deploy**

Every push to `main` will auto-deploy.

### Option C: Vercel CLI with production deploy

```bash
npm install
npx vercel --prod
```

---

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## Project Structure

```
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── public/
│   └── coaster.svg         # Favicon
└── src/
    ├── main.jsx            # React mount
    ├── App.jsx             # App wrapper
    ├── CoasterViz.jsx      # The dashboard (all data + charts)
    └── index.css           # Global styles
```

## Adding Coasters

All coaster data lives in the `coasters` array at the top of `src/CoasterViz.jsx`. Add a new object following the same schema:

```js
{
  name: "New Coaster",
  park: "Park Name",
  mfr: "Manufacturer",
  year: 2025,
  type: "Steel",
  height: 200,
  drop: 195,
  speed: 70,
  track: 3500,
  duration: "2:30",
  inversions: 3,
  gforce: 4.0,
  dropAngle: 85
}
```

If the park is new, add its color to `PARK_COLORS` and `PARK_GROUPS`.
