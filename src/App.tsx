import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { LessonPage } from './pages/LessonPage';
import { ParentsPage } from './pages/ParentsPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** Scrolls to the top on page change, or to #id when the URL has one. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function SiteLayout() {
  return (
    <>
      <SiteHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}

export function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/map" element={<MapPage />} />
        <Route path="/planet/:slug" element={<LessonPage />} />
        <Route path="/planet/:slug/:activity" element={<LessonPage />} />
        <Route path="/parents" element={<ParentsPage />} />
      </Routes>
    </>
  );
}
