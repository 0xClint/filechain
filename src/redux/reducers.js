import {
  GENERATE_HASH,
  GENERATE_ROOT_HASH,
  GET_COMMITS,
  GET_FILE,
  GET_TITLE,
  GET_USER_ADDRESS,
  LAST_COMMIT_INDEX,
} from "./action-types";

const initialState = {
  userAddress: "",
  title: "",
  files: [],
  hashes: [],
  rootHash: "",
  commits: [],
  lastCommitIndex: "",
};

export const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_ADDRESS: {
      // console.log("reducer" + action.data);
      return {
        ...state,
        userAddress: action.data,
      };
    }
    case GET_TITLE: {
      // console.log("reducer" + action.data);
      return {
        ...state,
        title: action.data,
      };
    }
    case GET_FILE: {
      // console.log("reducer" + action.data);
      return {
        ...state,
        files: [action.data],
      };
    }
    case GENERATE_HASH: {
      // console.log("reducer" + action.data);
      return {
        ...state,
        hashes: [...action.data],
      };
    }
    case GENERATE_ROOT_HASH: {
      // console.log("reducer" + action.data);
      return {
        ...state,
        rootHash: action.data,
      };
    }
    case GET_COMMITS: {
      // console.log("reducer" + action.data);
      return {
        ...state,
        commits: action.data,
      };
    }
    case LAST_COMMIT_INDEX: {
      // console.log("reducer" + action.data);
      return {
        ...state,
        lastCommitIndex: action.data,
      };
    }

    default:
      return state;
  }
};
