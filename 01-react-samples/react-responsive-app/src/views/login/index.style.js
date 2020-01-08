import styled, { css } from 'styled-components';

export const LoginContainer = styled.div`
  height: calc(100vh);
  width: 100%;
  display: flex;
  background-size: cover;
`;

export const LoginFormFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LoginButton = styled.button`
  font-size: 14px;
  border-radius: 8px;
  margin-top: 5px;
  padding: 10px;
  /* box-shadow: 0px 0px 8px 0px #aaaaaa; */
  &:hover {
    cursor: pointer;
  }
`;
export const Button = styled.button`
  font-size: 14px;
  border-radius: 8px;
  margin-top: 5px;
  padding: 10px;
  /* box-shadow: 0px 0px 8px 0px #aaaaaa; */
  &:hover {
    cursor: pointer;
  }
`;
export const OTPButton = styled.div`
  box-sizing: border-box;
  font-size: 16px;
  flex-shrink: 0;
  /* width: 30px; */
  background-color: 'blue';
  border: 1px solid;
  border-radius: 8px;
  /* height: 10px; */
  margin: auto 10px auto 20px;
  padding: 10px;
  /* box-shadow: 0px 0px 8px 0px #aaaaaa; */
  &:hover {
    cursor: pointer;
  }
`;

export const LoginOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px auto;
`;

export const LoginOption = styled.div`
  margin: 5px auto;
`;

export const LoginOptionButton = styled.button`
  font-size: 16px;
  min-width: 200px;
  background-color: 'green';
  border-radius: 8px;
  margin: 5px auto;
  padding: 10px;
  /* box-shadow: 0px 0px 8px 0px #aaaaaa; */
  &:hover {
    cursor: pointer;
    color: 'blue';
  }
`;

export const MobileLoginContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const email = css`
  height: 20px;
  padding: 3px;
  width: auto;
`;

export const LoginFormContainer = styled.div`
  border-radius: 5px;
  width: 400px;
  background-color: #f2f2f2;
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -150px;
  ${({ theme }) => theme.mobileL`
    width: 320px;
    margin-left: -160px;
  `};
`;

export const LoginTypeContainer = styled.div`
  min-height: 250px;
  display: flex;
  align-items: center;
`;

export const Form = styled.form``;
export const FormContainer = styled.div`
  width: 100%;
`;

export const FormLabel = styled.label`
  font-size: 20px;
  display: block;
  width: 100%;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
`;

const FormInputCSS = css`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
`;
export const EmailInput = styled.input.attrs((props) => ({ ...props, type: 'text' }))`
  ${FormInputCSS}
`;

export const MobileInput = styled.input.attrs((props) => ({ ...props, type: 'number', maxlength: '10' }))`
  ${FormInputCSS},
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
`;

export const OTPInput = styled.input.attrs((props) => ({ ...props, type: 'number' }))`
  ${FormInputCSS}
  outline: none;
  width: 200px;
  padding: 10px;
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
`;

export const PasswordInput = styled.input.attrs((props) => ({ ...props, type: 'password' }))`
  ${FormInputCSS}
`;

export const LoginRegisterContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const MarginBetween = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #656968;
  margin: 0px auto 5px auto;
`;
