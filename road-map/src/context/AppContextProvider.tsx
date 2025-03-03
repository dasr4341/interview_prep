import React, { createContext } from "react";

interface IRoadMapContext {
  active: {
    index: number;
    status: boolean;
  } | null;
}
const AppContext = createContext<{ roadMap: IRoadMapContext }>({
  roadMap: {
    active: null,
  },
});
function AppContextProvider() {
  const []
  return <AppContext.Provider value={} >AppContext</AppContext.Provider>;
}

export default AppContextProvider;
