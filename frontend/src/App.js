import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { Toaster } from "react-hot-toast";
// import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./components/redux/actions/userAction";
import Account from "./components/Account/Account";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import NewPost from "./components/NewPost/NewPost";
import NotFound from "./components/NotFound/NotFound";
import Search from "./components/Search/Search";
import UserProfile from "./components/UserProfile/UserProfile";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser()).catch((error) => {
      console.error("Error loading user:", error);
    });
  }, [dispatch]);

  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route
          path="/account"
          element={isAuthenticated ? <Account /> : <Login />}
        />
        <Route
          path="/registration"
          element={isAuthenticated ? <Account /> : <Registration />}
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Account /> : <Login />}
        />
        <Route
          path="/newpost"
          element={isAuthenticated ? <NewPost /> : <Login />}
        />

        <Route
          path="/update/profile"
          element={isAuthenticated ? <UpdateProfile /> : <Login />}
        />

        <Route
          path="/user/:id"
          element={isAuthenticated ? <UserProfile /> : <Login />}
        />

        <Route
          path="/search"
          element={isAuthenticated ? <Search /> : <Login />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
