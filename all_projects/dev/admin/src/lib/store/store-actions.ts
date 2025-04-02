import { GetCurrentAdminUser, GetUser, PretaaGetData_pretaaGetSalesStages } from 'generatedTypes';

export const storeActions = {
  auth: {
    getCurrentUserAction: () => ({ type: 'auth/getCurrentUser' }),
    getCurrentUser: 'auth/getCurrentUser',
    setUserAction: (payload: GetUser | null) => ({ type: 'auth/setUser', payload }),
    setSessionId: 'auth/setSessionId',
    setSessionIdAction: (payload: string) => ({ type: storeActions.auth.setSessionId, payload }),

    loginAction: 'auth/login',
    verifyOtp: 'auth/verifyOtp',
    updateTwoFactorAuthToken: 'auth/updateTwoFactorAuthToken',
    setLoginError: 'auth/setLoginError',
    getCurrentSuperAdmin: 'auth/getCurrentSuperAdmin',
    setAdmin: 'auth/setAdmin',
    setAdminAction: (payload: GetCurrentAdminUser | null ) => ({ type: storeActions.auth.setAdmin, payload })
  },

  dataSource: {
    setDateRange: (payload: any) => (
      {
        type: 'dataSource/setDateRange', payload
      }
    ),
    setSalesStage: (payload: PretaaGetData_pretaaGetSalesStages[]) => ({ type: 'dataSource/setSalesStage', payload })
  },
};
