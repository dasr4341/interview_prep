'use client';
import { AppStore, makeStore } from './store';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

// will call the current user, and check if loggedIn or not
// if not logged in then redirect to the sign in page

export default function AppStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
