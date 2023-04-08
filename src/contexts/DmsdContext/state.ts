type User = any; // Replace `any` with the actual user type

interface State {
  user: User | null;
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
  user: null,
};

const reducer = (state: State, action: Action): State => {
  const { type, data, payload } = action;
  switch (type) {
    case actions.addUser: {
      return {
        ...state,
        user: payload,
      };
    }
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
