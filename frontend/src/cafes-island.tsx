import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CafesCollaboratedSlider } from '@/components/cafes-collaborated-slider';
import '@/index.css';

const mount = document.getElementById('cafes-root');

if (mount) {
  createRoot(mount).render(
    <StrictMode>
      <CafesCollaboratedSlider />
    </StrictMode>
  );
}
