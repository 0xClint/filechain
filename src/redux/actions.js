import {
  GENERATE_HASH,
  GENERATE_ROOT_HASH,
  GET_COMMITS,
  GET_FILE,
  GET_TITLE,
  GET_USER_ADDRESS,
  LAST_COMMIT_INDEX,
} from "./action-types";

export const getTitle = (data) => {
  return {
    type: GET_TITLE,
    data,
  };
};
export const getFiles = (data) => {
  return {
    type: GET_FILE,
    data,
  };
};

export const getUserAddress = (data) => {
  return {
    type: GET_USER_ADDRESS,
    data,
  };
};

export const generateHash = (data) => {
  return {
    type: GENERATE_HASH,
    data,
  };
};
export const getRootHash = (data) => {
  return {
    type: GENERATE_ROOT_HASH,
    data,
  };
};
export const getCommits = (data) => {
  return {
    type: GET_COMMITS,
    data,
  };
};
export const getLastCommmitIndex = (data) => {
  return {
    type: LAST_COMMIT_INDEX,
    data,
  };
};
