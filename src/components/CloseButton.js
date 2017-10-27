import styled from 'styled-components';

export const CloseButtonStyled = styled.button`
  float: right;
  font-size: small;
  background: #fdfdfd;
  background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#ececec));
  background: linear-gradient(#f9f9f9, #ececec);
  border-radius: 3px;
  -webkit-box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 1px #fff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 1px #fff;
  color: #555;
  cursor: pointer;
  display: inline-block;
  margin: 0 5px;
  padding: 3px 11px 5px;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
  border: 1px;
`;

export default CloseButtonStyled;
