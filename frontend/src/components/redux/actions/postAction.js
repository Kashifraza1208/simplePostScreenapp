import axios from "axios";
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
} from "../constants/postConstants";

export const likePost = (id) => async (dispatch) => {
  try {
    dispatch({
      type: LIKE_REQUEST,
    });

    const { data } = await axios.get(`/api/v1/post/${id}`);

    dispatch({
      type: LIKE_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: LIKE_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const commentOnPost = (id, comment) => async (dispatch) => {
  try {
    dispatch({
      type: COMMENTS_REQUEST,
    });

    const { data } = await axios.put(
      `/api/v1/post/comment/${id}`,
      {
        comment,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: COMMENTS_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: COMMENTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteComment = (id, commentId) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_COMMENT_REQUEST,
    });

    const { data } = await axios.delete(`/api/v1/post/comment/${id}`, {
      data: { commentId },
    });

    dispatch({
      type: DELETE_COMMENT_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: DELETE_COMMENT_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const createNewPost = (caption, image) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_POST_REQUEST,
    });

    const { data } = await axios.post(
      "/api/v1/post/upload",
      {
        caption,
        image,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: NEW_POST_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: NEW_POST_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const updateCaption = (caption, id) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_CAPTION_REQUEST,
    });

    const { data } = await axios.put(
      ` /api/v1/post/${id}`,
      {
        caption,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
    dispatch({
      type: UPDATE_CAPTION_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CAPTION_FAIL,
      payload: error.response.data.message,
    });
  }
};

//DELETE POST
export const deletePost = (id) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_POST_REQUEST,
    });

    const { data } = await axios.delete(`/api/v1/post/${id}`);
    dispatch({
      type: DELETE_POST_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: DELETE_POST_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

//clearing message
export const clearMessage = () => async (dispatch) => {
  dispatch({ type: CLEAR_MESSAGE });
};
