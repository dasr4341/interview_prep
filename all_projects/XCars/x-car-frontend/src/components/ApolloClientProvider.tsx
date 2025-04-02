'use client';

import { client } from '@/lib/apolloClient';
import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';

const ApolloClientProvider = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientProvider;
