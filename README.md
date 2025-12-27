# HARP Parking System Dimension Calculator

A premium web-based calculator for determining required building dimensions for HARP parking systems.

## Features

- **5 Product Series**: Bolt, PitPro-111, PitPro-211, Elite, and Puzzle Parking
- **21 Configurations**: All models from the HARP catalogue
- **Premium UI**: Dark theme with glassmorphic effects and smooth animations
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Real-time Calculations**: Instant dimension calculations based on car specifications

## Local Development

Simply open `index.html` in your web browser. No build process required!

## Deployment to Cloudflare Pages

### Method 1: Using Cloudflare Dashboard (Recommended)

1. **Create a GitHub Repository** (if you haven't already)
   ```bash
   cd C:\Users\nikhi\.gemini\antigravity\scratch\harp-calculator
   git init
   git add .
   git commit -m "Initial commit: HARP calculator"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/harp-calculator.git
   git push -u origin main
   ```

2. **Deploy to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** → **Create application** → **Pages**
   - Click **Connect to Git**
   - Select your repository: `harp-calculator`
   - Configure build settings:
     - **Build command**: Leave empty (static site)
     - **Build output directory**: `/` (root directory)
   - Click **Save and Deploy**

3. **Your site will be live at**: `https://harp-calculator.pages.dev`

### Method 2: Using Wrangler CLI

1. **Install Wrangler** (if not already installed)
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy directly**
   ```bash
   cd C:\Users\nikhi\.gemini\antigravity\scratch\harp-calculator
   wrangler pages deploy . --project-name=harp-calculator
   ```

### Method 3: Drag and Drop (Quickest)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Create application** → **Pages**
3. Click **Upload assets**
4. Drag and drop the entire `harp-calculator` folder
5. Click **Deploy site**

## Project Structure

```
harp-calculator/
├── index.html              # Main HTML structure
├── style.css               # Premium design system
├── calculator.js           # Calculation logic
├── data/
│   └── specifications.js   # Product specifications
└── README.md              # This file
```

## Usage

1. Select a product series tab (Bolt, PitPro, Elite, or Puzzle)
2. Choose your configuration from the dropdown
3. Enter car dimensions (length or height)
4. Click "Calculate Dimensions"
5. View the required building dimensions

## Supported Parking Systems

- **Bolt Series (BS)**: Double stacker, 8 models
- **PitPro-111**: Three-level pit system, 6 models
- **PitPro-211**: Multi-level pit system, 2 models
- **Elite Series**: Four-post heavy-duty, 2 models
- **Puzzle Parking**: Matrix system, 3 configurations

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

All rights reserved. HARP Parking Systems.
