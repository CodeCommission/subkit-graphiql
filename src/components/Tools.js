import React from 'react';
import styled from 'styled-components';
import ExtentionsTraceStyled from './ExtentionsTraceStyled';
import CloseButton from './CloseButton';

const Overlay = styled.div`
  position: absolute;
  width: 50%;
  background-color: #eeeeee;
  z-index: 999;
  top: 20%;
  left: 25%;
  border: 1px solid #d6d6d6;
  display: ${props => (props.visible ? 'block' : 'none')};
  padding: 20px;
`;

const Title = styled.h2`
  font-family: system, -apple-system, 'San Francisco', '.SFNSDisplay-Regular', 'Segoe UI', Segoe, 'Segoe WP', 'Helvetica Neue', helvetica, 'Lucida Grande', arial, sans-serif;
  margin: 0px;
  display: inline-block;
`;

export default props => {
  return (
    <Overlay visible={props.visible}>
      <CloseButton onClick={() => props.onToolsClose && props.onToolsClose()}>Close</CloseButton>
      <Title>Some ... tooools</Title>
      <ExtentionsTraceStyled>Extention: {JSON.stringify(props.data, null, 2)}</ExtentionsTraceStyled>
    </Overlay>
  );
};
