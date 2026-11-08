import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GalleryPage } from '@/components/gallery-page';
import '@/index.css';

const mount = document.getElementById('gallery-root');

if (mount) {
  createRoot(mount).render(
    <StrictMode>
      <GalleryPage />
    </StrictMode>
  );
}
