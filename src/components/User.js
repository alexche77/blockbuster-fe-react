import React, { useState } from "react";
import { Card } from "react-bootstrap";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useDispatch } from "react-redux";
import { setUserGroup } from "../actions/userActions";
import ToggleButton from "react-bootstrap/ToggleButton";
const User = ({ user }) => {
  const getUserGroup = () =>
    user.groups && user.groups.length > 0 ? user.groups[0] : "User";
  const dispatch = useDispatch();
  const [group, setGroup] = useState(getUserGroup());
  const [error, setError] = useState(null);

  const handleGroupChange = (value) => {
    dispatch(setUserGroup(user, value))
      .then((obj) => {
        console.log(obj.group);
        setGroup(obj.group);
        setError(null);
      })
      .catch((error) => {
        let detail = error.response.data.detail;
        console.error(detail);
        setGroup(getUserGroup());
        setError(detail);
      });
  };
  return (
    <Card className="my-3 p-3 rounded">
      <Card.Body>
        <Card.Title as="div">
          <strong>{user.username}</strong>
        </Card.Title>

        <ToggleButtonGroup
          size="sm"
          type="radio"
          name="options"
          value={group}
          onChange={handleGroupChange}
        >
          <ToggleButton
            variant={group === "User" ? "info" : "primary"}
            value={"User"}
          >
            Regular User
          </ToggleButton>
          <ToggleButton
            variant={group === "Staff" ? "info" : "primary"}
            value={"Staff"}
          >
            Staff
          </ToggleButton>
          <ToggleButton
            variant={group === "Admins" ? "info" : "primary"}
            value={"Admins"}
          >
            Admin
          </ToggleButton>
        </ToggleButtonGroup>
      </Card.Body>
      { error && <Card.Footer className="text-muted">{error}</Card.Footer>}
    </Card>
  );
};

export default User;
