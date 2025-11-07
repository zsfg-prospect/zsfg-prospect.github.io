# Social Services Summary Frontend

This is the frontend application for the Social Services Summary tool, which helps social workers view and analyze patient social services information.

## Prerequisites

Before you begin, ensure you have Node.js and npm installed on your system. If you don't have them installed:

1. Visit [Node.js official website](https://nodejs.org/)
2. Download and install the LTS (Long Term Support) version for your operating system
3. The installation will include both Node.js and npm (Node Package Manager)

To verify the installation, open a terminal and run:
```bash
node --version
npm --version
```

## Installation

1. Navigate to the hospital-flow directory:
```bash
cd hospital-flow
```

2. Install project dependencies:
```bash
npm install
```

## Running the Development Server

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and visit:
```
http://localhost:3002
```

The application should now be running in development mode with hot-reload enabled (the page will automatically update when you make changes to the code).

## Project Structure

- `src/components/` - React components
- `src/pages/` - Next.js pages and routing
- `src/types/` - TypeScript type definitions
- `src/data/` - Mock data for development
- `src/styles/` - Global styles and CSS

## Features

- Patient information display
- Collapsible social services categories
- Source note references for each service category
- Responsive design with Tailwind CSS
- TypeScript for type safety

## Building and Deployment

### Local Testing

1. **Development Server** - Test changes locally:
```bash
npm run dev
```
Visit `http://localhost:3002` to see your changes

2. **Production Build** - Test the production build locally:
```bash
npm run build
npx serve out
```

### Deployment to GitHub Pages

This app is deployed to `https://zsfg-prospect.github.io/hospital-flow`

1. **Build the static export**:
```bash
npm run build
```

2. **Deploy the `out/` folder contents** to the `gh-pages` branch or GitHub Pages source

3. **If dependencies are corrupted**, clean install:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Troubleshooting

- **Build fails with module errors**: Clean install dependencies (see step 3 above)
- **Paths not working on GitHub Pages**: Verify `next.config.mjs` has correct `basePath: '/hospital-flow'`
- **Static assets not loading**: Ensure `assetPrefix` is set correctly in config

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
