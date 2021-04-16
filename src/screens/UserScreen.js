import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import User from "../components/User";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const UserScreen = () => {
  const distpatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    distpatch(getUsers());
  }, [distpatch]);

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error}</Message>
      ) : (
        <Row>
          {users.map((user) => (
            <Col sm={12} md={6} lg={4} xl={4} key={user.id}>
              <User user={user}></User>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default UserScreen;
