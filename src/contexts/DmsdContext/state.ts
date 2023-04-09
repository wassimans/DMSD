interface State {
  contractAddress: string | null;
  userAddress: string | null;
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
  contractAddress: "0x971298ee76a3cb04d80e418f32ec54b815b0a1f7",
  userAddress: null,
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
