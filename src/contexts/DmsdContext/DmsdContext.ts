import { createContext } from "react";

type DmsdContextType = {
  state: any;
  dispatch: any;
};

const DmsdContext = createContext<DmsdContextType>({
  state: null,
  dispatch: null,
});

export default DmsdContext;
