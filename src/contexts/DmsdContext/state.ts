interface State {
  contractAddress: string | undefined;
  userAddress: string | undefined;
}

interface Action {
  type: string;
  payload?: any;
  data?: any;
}

const actions = {
  addUser: "ADD_USER",
};

const initialState: State = {
  contractAddress: "0xdfDEAc5500C994ea915e46C8f6447CCB19911445",
  userAddress: undefined,
};

const reducer = (state: State, action: Action): State => {
  const { type, data, payload } = action;
  switch (type) {
    case actions.addUser: {
      return {
        ...state,
        userAddress: payload,
      };
    }
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
