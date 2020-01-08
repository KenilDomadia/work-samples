import * as React from 'react';
import {
  LoginFormContainer,
  FormContainer,
  FormLabel,
  EmailInput,
  PasswordInput,
  LoginButton,
  MobileInput,
  LoginOptionsContainer,
  LoginOption,
  LoginOptionButton,
  MarginBetween,
  MobileLoginContainer,
  OTPInput,
  LoginTypeContainer,
  Button,
  Form
} from './index.style';
import { userLoginAPI, verifyOTP, mobileLoginAPI } from '../../API/loginApi';

const allLoginOptions = ['email_password', 'phoneNumber'];
const loginOptionsLabel = {
  email_password: 'EMAIL',
  phoneNumber: 'MOBILE'
};

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleEmailLogin = this.handleEmailLogin.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleSendOTP = this.handleSendOTP.bind(this);
    this.handleVerifyOTP = this.handleVerifyOTP.bind(this);
    this.handleResendOTP = this.handleResendOTP.bind(this);
  }
  state = {
    loginVia: 'email_password',
    password: '',
    email: '',
    phoneNumber: '',
    otpSent: false,
    resendOTPLoading: false
  };

  handleLoginChange(e) {
    e.stopPropagation();
    this.setState({
      loginVia: e.target.value,
      password: '',
      email: '',
      phoneNumber: '',
      otpSent: false,
      otp: '',
      resendOTPLoading: false
    });
  }
  handleChange(e) {
    e.stopPropagation();
    if (e.target.name === 'phoneNumber' && e.target.value.length > 10) {
      return;
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async handleEmailLogin(e) {
    e.stopPropagation();
    const loginResponse = await userLoginAPI({ email: this.state.email, password: this.state.password, mode: 'email_password' });
    if (loginResponse.success) {
      this.props.onLoginSuccess(loginResponse);
    }
  }
  async handleVerifyOTP(e) {
    e.stopPropagation();
    const { phoneNumber, otp } = this.state;
    const otpVerificationResponse = await verifyOTP({ phoneNumber, otp });
    if (otpVerificationResponse.success) {
      this.props.onLoginSuccess(otpVerificationResponse);
    }
  }
  async handleResendOTP(e) {
    e.stopPropagation();
    const { phoneNumber } = this.state;
    this.setState({
      resendOTPLoading: true,
      otp: ''
    });
    const otpVerificationResponse = await mobileLoginAPI({ mode: 'phoneNumber', phoneNumber, resend: true });
    if (otpVerificationResponse.success) {
      this.setState({
        resendOTPLoading: false,
        otp: otpVerificationResponse.otp
      });
    }
  }

  async handleSendOTP(e) {
    e.stopPropagation();
    const loginResponse = await mobileLoginAPI({ mode: 'phoneNumber', phoneNumber: this.state.phoneNumber });
    if (loginResponse.success) {
      this.setState({
        otpSent: true,
        otp: loginResponse.otp
      });
    }
  }

  renderLoginOptions() {
    const toRenderLoginOptions = allLoginOptions.filter((item) => item !== this.state.loginVia);
    return (
      <LoginOptionsContainer>
        {this.state.otpSent ? this.renderOption('phoneNumber', 'change_number', 'CHANGE NUMBER') : null}
        <MarginBetween> OR </MarginBetween>
        {toRenderLoginOptions.map((option, index) => this.renderOption(option, index, `${loginOptionsLabel[option]} LOGIN`))}
      </LoginOptionsContainer>
    );
  }

  renderOption = (option, index, label) => (
    <LoginOption key={index}>
      <LoginOptionButton value={option} onClick={this.handleLoginChange}>
        {label}
      </LoginOptionButton>
    </LoginOption>
  );

  renderLoginViaEmailForm() {
    return (
      <FormContainer>
        <Form>
          <FormLabel>Email</FormLabel>
          <EmailInput placeholder="Enter email" value={this.state.email} name="email" onChange={this.handleChange} />
          <FormLabel>Password</FormLabel>
          <PasswordInput placeholder="Enter password" value={this.state.password} name="password" onChange={this.handleChange} />
        </Form>
        <LoginButton onClick={this.handleEmailLogin}> Login </LoginButton>
      </FormContainer>
    );
  }

  renderVerifyOTP() {
    const otpLabel = `${this.state.resendOTPLoading ? 'SENDING OTP' : 'OTP SENT'} TO ${this.state.phoneNumber}`;
    return (
      <FormContainer>
        <Form>
          <FormLabel style={{ fontSize: '15px' }}>{otpLabel}</FormLabel>
          <OTPInput value={this.state.otp} name="otp" placeholder="Enter 4 digit OTP" onChange={this.handleChange} />
        </Form>
        <MobileLoginContainer>
          <Button onClick={this.handleVerifyOTP} disbale={this.state.resendOTPLoading}>
            Verify
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={this.handleResendOTP}>
            Resend
          </Button>
        </MobileLoginContainer>
      </FormContainer>
    );
  }

  renderLoginViaMobile() {
    return (
      <FormContainer>
        <Form>
          <FormLabel>Mobile Number</FormLabel>
          <MobileInput placeholder="Enter phone number" value={this.state.phoneNumber} name="phoneNumber" onChange={this.handleChange} />
        </Form>
        <Button onClick={this.handleSendOTP}> SEND OTP </Button>
      </FormContainer>
    );
  }

  renderLoginFormsBasedOnType() {
    switch (this.state.loginVia) {
      case 'phoneNumber': {
        if (this.state.otpSent) {
          return this.renderVerifyOTP();
        }
        return this.renderLoginViaMobile();
      }
      default:
        return this.renderLoginViaEmailForm();
    }
  }

  render() {
    return (
      <LoginFormContainer>
        <LoginTypeContainer>{this.renderLoginFormsBasedOnType()}</LoginTypeContainer>
        {this.renderLoginOptions()}
      </LoginFormContainer>
    );
  }
}
