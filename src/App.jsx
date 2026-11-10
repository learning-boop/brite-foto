import { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Motion from './components/Motion';
import Footer, { AnnounceBar } from './components/Footer';
import { CartDrawer, NavDrawer, Scrim, Toast, WhatsAppButton } from './components/Overlays';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Done from './pages/Done';
import { About, Bulk, Contact } from './pages/InfoPages';
// phone and tablet fixes: imported last so they override component styles
import './styles/mobile.css';

function Page() {
  const { route } = useStore();
  switch (route.v) {
    case 'shop': return <Shop />;
    case 'product': return <Product key={route.id} id={route.id} />;
    case 'checkout': return <Checkout />;
    case 'done': return <Done />;
    case 'bulk': return <Bulk />;
    case 'about': return <About />;
    case 'contact': return <Contact />;
    default: return <Home />;
  }
}

function Layout() {
  const { drawer, closeDrawers } = useStore();
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && drawer) closeDrawers(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawer, closeDrawers]);

  return (
    <>
      <a className="skip" href="#main" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <AnnounceBar />
      <Header />
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}><Page /></main>
      <Footer />
      <Scrim />
      <NavDrawer />
      <CartDrawer />
      <WhatsAppButton />
      <Toast />
      <Motion />
    </>
  );
}

export default function App() {
  return <StoreProvider><Layout /></StoreProvider>;
}
