// base design system first, so component styles (header, hero) can refine it
import './styles/global.css';
import './styles/motion.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import logo from './assets/logo.png';
import { makeImages } from './lib/scenes';

// procedural photos for pack mockups and swatches (--img0..3) and the logo used on packs
makeImages();
document.documentElement.style.setProperty('--logo', `url("${logo}")`);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
