import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  ALL_USER_FAIL,
  ALL_USER_REQUEST,
  ALL_USER_SUCCESS,
  CLEAR_MESSAGE,
  GET_MYPOST_FAIL,
  GET_MYPOST_REQUEST,
  GET_MYPOST_SUCCESS,
  GET_USER_PROFILE_FAIL,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  POSTOF_FOLLOWING_FAIL,
  POSTOF_FOLLOWING_REQUEST,
  POSTOF_FOLLOWING_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/userConstants";

// Function to get user authentication status from localStorage
const getAuthStatusFromLocalStorage = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  return isAuthenticated ? JSON.parse(isAuthenticated) : false;
};

export const userReducer = (
  state = { user: {}, isAuthenticated: getAuthStatusFromLocalStorage() },
  action
) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_USER_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        loading: true,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
    case REGISTER_USER_SUCCESS:
    case LOAD_USER_SUCCESS:
      return {
        //means retain authenticated states
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case LOGOUT_SUCCESS:
      return {
        loading: false,
        user: null,
        isAuthenticated: false,
      };

    case LOGIN_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case REGISTER_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case LOAD_USER_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case LOGOUT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: null,
      };

    default:
      return state;
  }
};

export const postOfFollowingReducer = (state = { posts: [] }, action) => {
  switch (action.type) {
    case POSTOF_FOLLOWING_REQUEST:
      return {
        loading: true,
        posts: [],
      };
    case POSTOF_FOLLOWING_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case POSTOF_FOLLOWING_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: null,
      };
    default:
      return state;
  }
};

export const allUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case ALL_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case ALL_USER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: null,
      };
    default:
      return state;
  }
};

export const userProfileReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case GET_USER_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case GET_USER_PROFILE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const myPostReducer = (state = { posts: [] }, action) => {
  switch (action.type) {
    case GET_MYPOST_REQUEST:
      return {
        loading: true,
        posts: [],
      };
    case GET_MYPOST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case GET_MYPOST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
