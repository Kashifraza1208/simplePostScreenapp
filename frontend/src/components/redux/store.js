import { createStore, combineReducers, applyMiddleware } from "redux";
// import { configureStore } from '@reduxjs/toolkit'
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userReducer,
  allUsersReducer,
  postOfFollowingReducer,
  myPostReducer,
  userProfileReducer,
} from "./reducers/userReducer";
import { likeReducer, userPostReducer } from "./reducers/postReducer";

const reducer = combineReducers({
  user: userReducer,
  postOfFollowing: postOfFollowingReducer,
  allUsers: allUsersReducer,
  like: likeReducer,
  myPosts: myPostReducer,
  userProfile: userProfileReducer,
  userPosts: userPostReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
