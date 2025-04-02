import  { useContext, useState, createContext } from 'react';

export const DischargeDropDownPlaceholderContext = createContext<{
  error: string | null;
  setError: (e: string | null) => void;
}>({
  error: null,
  setError: (e) => {},
});

export function useDischargeDropDownPlaceholder() {
  return useContext(DischargeDropDownPlaceholderContext);
}

export default function DischargeDropDownPlaceholderProvider({ children }: { children: JSX.Element }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <DischargeDropDownPlaceholderContext.Provider
      value={{
        error,
        setError: (e: string | null) => setError(e)
      }}>
      {children}
    </DischargeDropDownPlaceholderContext.Provider>
  );
}
