import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';

// Which optional generated images are present in public/images. The site only asks the browser
// for art that exists, and falls back to its drawn versions for the rest.
const art = fs.existsSync('public/images') ? fs.readdirSync('public/images') : [];

// base './' so the build works on GitHub Pages (any repo path) and on Vercel/Netlify alike.
export default defineConfig({ plugins: [react()], base: './', define: { __ART__: JSON.stringify(art) } });
