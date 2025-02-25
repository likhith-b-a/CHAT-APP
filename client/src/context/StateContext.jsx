import { createContext, useContext, useReducer } from "react";

export const StateContext = createContext();

export const StateProvider = ({ initialState, reducer, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateProvider = () => {
  const context = useContext(StateContext);
  if (!context)
    throw new Error("useStateProvider must be used within a StateProvider");
  return context;
};
