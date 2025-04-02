import { useEffect, useState } from 'react';

function useCheckConnection() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    window.addEventListener('offline', () => setIsOffline(true));
    window.addEventListener('online', () => setIsOffline(false));
  }, []);

  return {
    isOffline,
  };
}

export default useCheckConnection;
