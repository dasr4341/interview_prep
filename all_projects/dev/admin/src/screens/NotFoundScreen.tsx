import React from 'react';
import { useLocation } from 'react-router-dom';

export default function NotFoundScreen() {
  const location = useLocation();

  return (
    <div>
      <h1 className="text-2xl">Not found { location.pathname } </h1>
    </div>
  );
}
