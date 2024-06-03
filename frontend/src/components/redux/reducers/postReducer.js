import {
  CLEAR_ERRORS,
  CLEAR_MESSAGE,
  COMMENTS_FAIL,
  COMMENTS_REQUEST,
  COMMENTS_SUCCESS,
  DELETE_COMMENT_FAIL,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_POST_FAIL,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  LIKE_FAIL,
  LIKE_REQUEST,
  LIKE_SUCCESS,
  NEW_POST_FAIL,
  NEW_POST_REQUEST,
  NEW_POST_SUCCESS,
  UPDATE_CAPTION_FAIL,
  UPDATE_CAPTION_REQUEST,
  UPDATE_CAPTION_SUCCESS,
  USER_POST_FAIL,
  USER_POST_REQUEST,
  USER_POST_SUCCESS,
} from "../constants/postConstants";

import {
  DELETE_PROFILE_FAIL,
  DELETE_PROFILE_REQUEST,
  DELETE_PROFILE_SUCCESS,
  FOLLOW_USER_FAIL,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from "../constants/userConstants";

export const likeReducer = (state = {}, action) => {
  switch (action.type) {
    case LIKE_REQUEST:
    case COMMENTS_REQUEST:
    case DELETE_COMMENT_REQUEST:
    case NEW_POST_REQUEST:
    case UPDATE_CAPTION_REQUEST:
    case DELETE_POST_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case DELETE_PROFILE_REQUEST:
    case FOLLOW_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LIKE_SUCCESS:
    case COMMENTS_SUCCESS:
    case DELETE_COMMENT_SUCCESS:
    case NEW_POST_SUCCESS:
    case UPDATE_CAPTION_SUCCESS:
    case DELETE_POST_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
    case DELETE_PROFILE_SUCCESS:
    case FOLLOW_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case LIKE_FAIL:
    case COMMENTS_FAIL:
    case DELETE_COMMENT_FAIL:
    case NEW_POST_FAIL:
    case UPDATE_CAPTION_FAIL:
    case DELETE_POST_FAIL:
    case UPDATE_PROFILE_FAIL:
    case DELETE_PROFILE_FAIL:
    case FOLLOW_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
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

export const userPostReducer = (state = { posts: [] }, action) => {
  switch (action.type) {
    case USER_POST_REQUEST:
      return {
        loading: true,
        posts: [],
      };
    case USER_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case USER_POST_FAIL:
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
