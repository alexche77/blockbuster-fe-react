import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const logOutHandler = () => {
    dispatch(logout());
  };
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect fixed="top">
        <Container>
          <Navbar.Brand>BlockBuster</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <LinkContainer to="/movies">
                <Nav.Link>
                  <i className="fas fa-film"></i> Movies
                    </Nav.Link>
              </LinkContainer>
              {(userInfo && userInfo.groups !== undefined && userInfo.groups.length > 0) && (
                <>

                  <LinkContainer to="/orders">
                    <Nav.Link>
                      <i className="fas fa-box-open"></i> Orders
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
              {(userInfo && userInfo.groups !== undefined && userInfo.groups.includes("Admins")) && (
                <LinkContainer to="/users">
                  <Nav.Link>
                    <i className="fas fa-user-tie"></i> Users
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo ? (
                <NavDropdown title={userInfo.username} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logOutHandler}>
                    Log out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
