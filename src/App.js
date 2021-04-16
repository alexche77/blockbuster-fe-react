import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import MovieScreen from "./screens/MovieScreen";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UserScreen from "./screens/UserScreen";
import MovieListScreen from "./screens/MovieListScreen";
import OrdersListScreen from "./screens/OrdersListScreen";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const App = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (userInfo) {
      setIsLoggedIn(true);
      setIsStaff(
        userInfo &&
          userInfo.groups !== undefined &&
          userInfo.groups.includes("Staff")
      );
      setIsAdmin(
        userInfo &&
          userInfo.groups !== undefined &&
          userInfo.groups.includes("Admins")
      );
    } else {
      setIsLoggedIn(false);
      setIsStaff(false);
      setIsAdmin(false);
    }
  }, [userInfo]);
  return (
    <Router>
      <Header />
      <main className="py-5 my-5">
        <Container className="mt-3">
          <ProtectedRoute
            isEnabled={true}
            path="/login"
            component={LoginScreen}
          />
          <ProtectedRoute
            isEnabled={true}
            path="/register"
            component={RegisterScreen}
          />
          {isAdmin && (
            <ProtectedRoute
              isEnabled={isAdmin}
              path="/users"
              component={UserScreen}
            />
          )}
          {isAdmin && (
            <ProtectedRoute
              isEnabled={isAdmin}
              path="/user/:id"
              component={ProfileScreen}
            />
          )}
          <ProtectedRoute
            isEnabled={isLoggedIn}
            path="/profile"
            component={ProfileScreen}
          />
          <ProtectedRoute
            isEnabled={true}
            path="/movies"
            component={MovieListScreen}
          />
          <ProtectedRoute
            isEnabled={true}
            path="/movie/:id"
            component={MovieScreen}
          />
          <ProtectedRoute
            isEnabled={isStaff}
            path="/orders"
            component={OrdersListScreen}
          />
          <ProtectedRoute
            isEnabled={isLoggedIn}
            path="/cart/:id?"
            component={CartScreen}
          />
          <Route exact path="/">
            <Redirect to="/movies" />
          </Route>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
