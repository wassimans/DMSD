import { useReducer, ReactNode } from "react";
import { reducer, initialState } from "./state";
import DmsdContext from "./DmsdContext";

interface Props {
  children: ReactNode;
}

function DmsdProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DmsdContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </DmsdContext.Provider>
  );
}

export default DmsdProvider;
