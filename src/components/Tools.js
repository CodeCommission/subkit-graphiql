import React from 'react';
import styled from 'styled-components';
import ExtentionsTraceStyled from './ExtentionsTraceStyled';
import CloseButton from './CloseButton';
import SaveButton from './SaveButton';
import ActionButton from './ActionButton';
import { sign } from 'jsonwebtoken';

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

const InputFieldSet = styled.fieldset`
  margin: 20px 0;
  padding 20px;
  border: 1px solid gray;
`;

const InputFieldSetLegend = styled.legend`
  font-family: system, -apple-system, 'San Francisco', '.SFNSDisplay-Regular', 'Segoe UI', Segoe, 'Segoe WP', 'Helvetica Neue', helvetica, 'Lucida Grande', arial, sans-serif;
`;

const InputFieldLabel = styled.label`
  font-family: system, -apple-system, 'San Francisco', '.SFNSDisplay-Regular', 'Segoe UI', Segoe, 'Segoe WP', 'Helvetica Neue', helvetica, 'Lucida Grande', arial, sans-serif;
  display: block;
  margin: 5px 0;
`;

const FullSizeInputField = styled.input`
  font-family: system, -apple-system, 'San Francisco', '.SFNSDisplay-Regular', 'Segoe UI', Segoe, 'Segoe WP', 'Helvetica Neue', helvetica, 'Lucida Grande', arial, sans-serif;
  padding: 5px;
  width: 98%;
`;

const HalfSizeInputField = styled.input`
  font-family: system, -apple-system, 'San Francisco', '.SFNSDisplay-Regular', 'Segoe UI', Segoe, 'Segoe WP', 'Helvetica Neue', helvetica, 'Lucida Grande', arial, sans-serif;
  padding: 5px;
  width: 80%;
`;

const InputField = styled.input`
  font-family: system, -apple-system, 'San Francisco', '.SFNSDisplay-Regular', 'Segoe UI', Segoe, 'Segoe WP', 'Helvetica Neue', helvetica, 'Lucida Grande', arial, sans-serif;
  padding: 5px;
  width: 98%;
`;

export default class Tools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: this.getJWT(),
      secret: '',
    };
  }

  setJWT(data) {
    localStorage['subkit-graphiql-token'] = JSON.stringify(data);
  }

  getJWT() {
    try {
      return JSON.parse(localStorage['subkit-graphiql-token']);
    } catch (error) {
      return '';
    }
  }

  generateJWT(secret) {
    const jwt = sign({}, secret);
    this.setState({ jwt }, () => this.setJWT(jwt));
  }

  saveJWT() {
    this.props.onToolsClose && this.props.onToolsClose();
  }

  render() {
    return (
      <Overlay visible={this.props.visible}>
        <CloseButton onClick={() => this.props.onToolsClose && this.props.onToolsClose()}>Close</CloseButton>
        <Title>Settings</Title>
        <InputFieldSet>
          <InputFieldSetLegend>JWT</InputFieldSetLegend>
          <InputFieldLabel>Generate</InputFieldLabel>
          <HalfSizeInputField type="text" placeholder="Enter your secret here" onBlur={e => this.setState({ secret: e.target.value })} />
          <ActionButton onClick={() => this.generateJWT(this.state.secret)}>Generate</ActionButton>
          <InputFieldLabel>Token</InputFieldLabel>
          <FullSizeInputField
            type="text"
            placeholder="Enter your JWT here"
            onChange={e => {
              e.persist();
              this.setState({ jwt: e.target.value }, () => this.setJWT(e.target.value));
            }}
            value={this.state.jwt}
          />
          <SaveButton onClick={() => this.saveJWT()}>Save</SaveButton>
        </InputFieldSet>
      </Overlay>
    );
  }
}
