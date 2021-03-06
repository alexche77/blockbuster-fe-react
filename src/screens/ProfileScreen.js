import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Container, Pagination } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetail, updateUserProfile } from "../actions/userActions";
import Order from "../components/Order";
import { listOrders } from "../actions/orderActions";

const ProfileScreen = ({ history, location }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const {
    loadingOrders,
    errorOrders,
    ordersResponse: { next, previous, count, results },
  } = orderList;
  const [currentPage, setCurrentPage] = useState(1);
  const parseParams = (searchParams) => new URLSearchParams(searchParams)
  const parseSearch = (url) => !url ? '#' : new URL(url).search
  const handlePagination = (search) => {
    if (loading) return;
    if (!search) {
      history.push("/profile");
    } else {
      history.push(search);
    }
  };

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      let currentPage = parseParams(location.search).get("page");
      if (currentPage) {
        setCurrentPage(currentPage);
      } else {
        setCurrentPage(1);
      }
      dispatch(listOrders(location.search));
      if (!userInfo.username) {
        dispatch(getUserDetail("me"));
      } else {
        setUsername(userInfo.username);
        setEmail(userInfo.email);
      }
    }
  }, [history, dispatch, userInfo, location]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      setMessage("Passwords don't match");
    } else {
      console.log("Updating profile");
      setMessage(null);
      dispatch(updateUserProfile({ id: user._id, username, email, password }));
    }
  };

  const paginationBasic = (
    <div>
      <Pagination>
        <Pagination.First
          disabled={!previous}
          href={"?page=1"}
          onClick={(e) => {
            e.preventDefault();
            handlePagination("?page=1");
          }}
        />
        <Pagination.Prev
          disabled={!previous}
          onClick={(e) => {
            e.preventDefault();
            handlePagination(parseSearch(previous));
          }}
        />
        <Pagination.Item active>{currentPage}</Pagination.Item>
        <Pagination.Next
          disabled={!next}
          onClick={(e) => {
            e.preventDefault();
            handlePagination(parseSearch(next));
          }}
        />
        <Pagination.Last
          disabled={!next}
          href={`?page=${Math.round(count / 6) + (count % 6 > 0 ? 1 : 0)}`}
          onClick={(e) => {
            e.preventDefault();
            handlePagination(
              `?page=${Math.round(count / 6) + (count % 6 > 0 ? 1 : 0)}`
            );
          }}
        />
      </Pagination>
    </div>
  );

  return (
    <Row>
      <Col md={3}>
        {loading && <Loader />}
        <h2>User profile</h2>
        {message && <Message variant="warning"> {message}</Message>}
        {success && <Message variant="success"> Profile updated</Message>}
        {error && <Message variant="danger"> {error}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="username">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password address</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Password confirmation</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        <Container>
          <Row  className="py-4">{paginationBasic}</Row>
          <Row>
            {results.map((order) => (
              <Col sm={12} md={4} lg={4} xl={4} key={order.id}>
                <Order order={order}></Order>
              </Col>
            ))}
          </Row>
        </Container>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
