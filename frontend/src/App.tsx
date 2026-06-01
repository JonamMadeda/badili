import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import ConverterPage from './pages/ConverterPage';

type Page = 'landing' | 'converter';

function App() {
  const [page, setPage] = useState<Page>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash === 'convert' ? 'converter' : 'landing';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setPage(hash === 'convert' ? 'converter' : 'landing');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: Page) => {
    setPage(to);
    window.location.hash = to === 'converter' ? '#convert' : '';
  };

  if (page === 'converter') {
    return <ConverterPage onHome={() => navigate('landing')} />;
  }

  return <LandingPage onStart={() => navigate('converter')} />;
}

export default App;
