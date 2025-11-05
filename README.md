# Weather Cards — Manual Entry (React + Vite)

Simple React app built with Vite that lets you manually enter weather details and shows elegant, persistent cards in a responsive grid.

## Features
- Enter City, Country, Unit, Temperature, Feels like, Condition, Humidity, Wind
- Add cards, remove a card, clear all (confirm), empty state guidance
- Local persistence via localStorage; cards survive refresh
- Responsive CSS grid (1 / 2 / 3 columns), hover lift, rounded cards, subtle shadows
- Small inline SVG icons mapped from condition text
- Basic validation (City required, numeric checks), accessible labels

## How to run

### Install dependencies
```powershell
npm install
```

### Development server (with hot reload)
```powershell
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for production
```powershell
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview production build locally
```powershell
npm run preview
```

## Project structure
```
weather/
├── src/
│   ├── App.jsx       # Main React component
│   ├── App.css       # Styles
│   └── main.jsx      # Entry point
├── index.html        # HTML template
├── package.json      # Dependencies
├── vite.config.js    # Vite config
└── README.md
```

## Testing checklist
- Add three valid cities, verify grid layout on narrow and wide windows
- Remove the middle card; the others should remain
- Refresh page — cards should persist
- Try invalid input (empty city, non-numeric humidity) and verify friendly error messages
- Use Clear All and confirm — grid becomes empty and empty state displays

## Tech stack
- React 18
- Vite 5 (fast build tool with hot module replacement)
- No external UI libraries (pure CSS)
- localStorage for persistence

## Deliverables you still need to capture
- One desktop screenshot and one mobile-width screenshot: resize the browser and take screenshots
- A 30–45 second screen recording showing add/remove/clear/refresh persistence
