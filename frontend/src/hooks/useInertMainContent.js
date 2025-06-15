import { useEffect } from 'react';

export default function useInertMainContent() {
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.setAttribute('inert', '');
    mainContent.setAttribute('aria-hidden', 'true');
    return () => {
      mainContent.removeAttribute('inert');
      mainContent.removeAttribute('aria-hidden');
    };
  }, []);
}
