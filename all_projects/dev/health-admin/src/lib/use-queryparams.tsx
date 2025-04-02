/*  */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';


export default function useQueryParams() {
  const location = useLocation();
  const [query, setQuery] = useState<any | null>(queryString.parse(location.search));

  useEffect(() => {
    if (location.search) {
      setQuery(queryString.parse(location.search));
    } else {
      setQuery('');
    }
  }, [location.search]);

  return query;
}
