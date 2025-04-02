import emmiter from 'event-emitter';

export const appEventBus = emmiter();

export const appEvents = {
  invalidAuthToken: 'INVALID_AUTH_TOKEN'
};
