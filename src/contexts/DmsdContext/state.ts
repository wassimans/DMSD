interface State {
  contractAddress: `0x${string}` | undefined;
  userAddress: `0x${string}` | undefined;
  currentUser: User | undefined;
  vaultApproved: boolean | undefined;
}

interface Action {
  type: string;
  payload?: any;
  data?: any;
}

const actions = {
  addUserAddress: "ADD_USER_ADDRESS",
  addUser: "ADD_USER",
  subscribeUser: "SUBSCRIBE_USER",
  approveVault: "APPROVE_VAULT",
};

const initialState: State = {
  contractAddress: "0x4bb32c9ab57f8870019e8f7c4966965e425f7c52",
  // contractAddress: "0x7354f22a42120A8B83b0D3d2087eA1f81589380E",
  userAddress: undefined,
  currentUser: undefined,
  vaultApproved: false,
};

const reducer = (state: State, action: Action): State => {
  const { type, data, payload } = action;
  switch (type) {
    case actions.addUserAddress: {
      return {
        ...state,
        userAddress: payload,
      };
    }
    case actions.addUser: {
      return {
        ...state,
        currentUser: payload,
      };
    }
    case actions.approveVault: {
      return {
        ...state,
        vaultApproved: payload,
      };
    }
    case actions.subscribeUser: {
      return {
        ...state,
        currentUser: {
          subscribed: payload as boolean | undefined,
          email: state.currentUser?.email || "",
          username: state.currentUser?.username || "",
          isRegistered: state.currentUser?.isRegistered || false,
          isAdmin: state.currentUser?.isAdmin || false,
        },
      };
    }
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };

export interface User {
  email: string | undefined;
  username: string | undefined;
  isRegistered: boolean | undefined;
  isAdmin: boolean | undefined;
  subscribed: boolean | undefined;
}
