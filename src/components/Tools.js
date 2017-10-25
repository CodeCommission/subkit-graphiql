import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: absolute;
  width: 50%;
  height: 40%;
  background-color: #eeeeee;
  z-index: 999;
  top: 20%;
  left: 25%;
  border: 1px solid #d6d6d6;
  display: ${props => (props.visible ? "block" : "none")};
  padding: 20px;
`;

const Title = styled.h2`
  font-family: system, -apple-system, "San Francisco", ".SFNSDisplay-Regular",
    "Segoe UI", Segoe, "Segoe WP", "Helvetica Neue", helvetica, "Lucida Grande",
    arial, sans-serif;
  margin: 0px;
`;

export default props => {
  return (
    <Overlay visible={props.visible}>
      <Title>Some ... tooools</Title>
    </Overlay>
  );
};
