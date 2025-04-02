export const userRoutes = {

  sessionExpired: {
    match: '/session-expired',
    buildUrl: ({ type }: { type: string }) => `/session-expired?type=${type}`,
  },
}
