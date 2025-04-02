import React, { useEffect } from 'react';

export default function Redirects() {
  useEffect(() => {
    if (location.href.includes('pretaa-health-staging.netlify.app')) {
      const url = location.href.replace('pretaa-health-staging.netlify.app', 'dashboard.pretaa.com');
      location.href = url;
    }
  }, []);
  return (
    <div></div>
  );
}
