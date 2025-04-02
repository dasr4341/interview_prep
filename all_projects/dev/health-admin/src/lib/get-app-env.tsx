import { config } from 'config';
import  { useEffect, useState } from 'react';

export default function UseAppEnv() {
  const [isDev, setIsDev] = useState(false);
  

  useEffect(() => {
    if (localStorage.getItem(config.storage.app_env) === 'development' || process.env.NODE_ENV === 'development') {
      setIsDev(true);
    }
  }, []);

  return {
    isDev
  };
}

export function isDevMode() {
  return localStorage.getItem(config.storage.app_env) === 'development' || process.env.NODE_ENV === 'development';
}

export function isProdMode() {
  return localStorage.getItem(config.storage.app_env) === 'production' || process.env.NODE_ENV !== 'development';
}