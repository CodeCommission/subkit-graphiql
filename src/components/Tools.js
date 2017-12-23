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
  width: 95%;
`;

const HalfSizeInputField = styled.input`
  font-family: system, -apple-system, 'San Francisco', '.SFNSDisplay-Regular', 'Segoe UI', Segoe, 'Segoe WP', 'Helvetica Neue', helvetica, 'Lucida Grande', arial, sans-serif;
  padding: 5px;
  width: 46%;
`;

const ErrorMessage = styled.div`
  padding: 15px 0 0 0;
  height: 20px;
  font-family: system, -apple-system, 'San Francisco', '.SFNSDisplay-Regular', 'Segoe UI', Segoe, 'Segoe WP', 'Helvetica Neue', helvetica, 'Lucida Grande', arial, sans-serif;
  color: red;
`;

export default class Tools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: this.getJWT(),
      payloadJWT: {},
      secret: 'SuperSecret',
      error: '',
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

  generateJWT() {
    try {
      const jwt = sign(this.state.payloadJWT, this.state.secret);
      this.setState({ jwt, error: '' });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  saveJWT() {
    this.setJWT(this.state.jwt);
    this.props.onToolsClose && this.props.onToolsClose();
  }

  render() {
    return (
      <Overlay visible={this.props.visible}>
        <CloseButton onClick={() => this.props.onToolsClose && this.props.onToolsClose()}>Close</CloseButton>
        <Title>Authentication & Authorization Settings</Title>
        <InputFieldSet>
          <InputFieldSetLegend>JSON Web Token</InputFieldSetLegend>
          <div>
            <InputFieldLabel>Secret</InputFieldLabel>
            <FullSizeInputField type="password" placeholder="Enter your JWT-Secret" onBlur={e => this.setState({ secret: e.target.value })} defaultValue={this.state.secret} />
            <br />
            <br />
            <InputFieldLabel>Fields</InputFieldLabel>
            <HalfSizeInputField
              type="text"
              placeholder="Key"
              innerRef={input => (this.key1 = input)}
              onBlur={() => this.setState({ payloadJWT: Object.assign({}, this.state.payloadJWT, { [this.key1.value]: this.value1.value }) })}
            />&nbsp;=&nbsp;<HalfSizeInputField
              type="text"
              placeholder="Value"
              innerRef={input => (this.value1 = input)}
              onBlur={() => this.setState({ payloadJWT: Object.assign({}, this.state.payloadJWT, { [this.key1.value]: this.value1.value }) })}
            />
            <HalfSizeInputField
              type="text"
              placeholder="Key"
              innerRef={input => (this.key2 = input)}
              onBlur={() => this.setState({ payloadJWT: Object.assign({}, this.state.payloadJWT, { [this.key2.value]: this.value2.value }) })}
            />&nbsp;=&nbsp;<HalfSizeInputField
              type="text"
              placeholder="Value"
              innerRef={input => (this.value2 = input)}
              onBlur={() => this.setState({ payloadJWT: Object.assign({}, this.state.payloadJWT, { [this.key2.value]: this.value2.value }) })}
            />
            <HalfSizeInputField
              type="text"
              placeholder="Key"
              innerRef={input => (this.key3 = input)}
              onBlur={() => this.setState({ payloadJWT: Object.assign({}, this.state.payloadJWT, { [this.key3.value]: this.value3.value }) })}
            />&nbsp;=&nbsp;<HalfSizeInputField
              type="text"
              placeholder="Value"
              innerRef={input => (this.value3 = input)}
              onBlur={() => this.setState({ payloadJWT: Object.assign({}, this.state.payloadJWT, { [this.key3.value]: this.value3.value }) })}
            />
            <HalfSizeInputField
              type="text"
              placeholder="Key"
              innerRef={input => (this.key4 = input)}
              onBlur={() => this.setState({ payloadJWT: Object.assign({}, this.state.payloadJWT, { [this.key4.value]: this.value4.value }) })}
            />&nbsp;=&nbsp;<HalfSizeInputField
              type="text"
              placeholder="Value"
              innerRef={input => (this.value4 = input)}
              onBlur={() => this.setState({ payloadJWT: Object.assign({}, this.state.payloadJWT, { [this.key4.value]: this.value4.value }) })}
            />
            <ErrorMessage>{this.state.error}</ErrorMessage>
            <ActionButton onClick={() => this.generateJWT()}>Generate a API-Token</ActionButton>
          </div>
          <br />
          <br />
          <div>
            <InputFieldLabel>Your API-Token</InputFieldLabel>
            <FullSizeInputField
              type="text"
              placeholder="Enter your existing JWT"
              onChange={e => {
                e.persist();
                this.setState({ jwt: e.target.value }, () => this.setJWT(e.target.value));
              }}
              value={this.state.jwt}
            />
          </div>
          <SaveButton onClick={() => this.saveJWT()}>Apply & Save</SaveButton>
        </InputFieldSet>
      </Overlay>
    );
  }
}
