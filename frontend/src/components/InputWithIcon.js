import React from "react";
import { InputGroup, FloatingLabel, Form } from "react-bootstrap";
import "./css/inputWithIcon.css";

const InputWithIcon = ({
  data_testid = "test",
  icon,
  onClick,
  error,
  iconColor,
  setInputValues,
  ...props
}) => {
  const changeHandler = (e) => {
    setInputValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <InputGroup
      data-testid={"input-with-icon-group-" + data_testid}
      className={"input-with-icon " + (error && "is_invalid")}
    >
      <FloatingLabel label={props.placeholder} className="mt-3">
        <Form.Control
          {...props}
          onChange={changeHandler}
          data-testid={"input-with-icon-input-" + data_testid}
        />
        <i
          onClick={onClick}
          data-testid={"input-with-icon-icon-" + data_testid}
          className={icon}
          style={{ color: iconColor }}
        ></i>
        <Form.Text muted data-testid={"input-with-icon-text-" + data_testid}>
          {error}
        </Form.Text>
      </FloatingLabel>
    </InputGroup>
  );
};
export { InputWithIcon };