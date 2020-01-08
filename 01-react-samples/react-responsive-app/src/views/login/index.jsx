import * as React from 'react';
import { decode } from 'jsonwebtoken';
import { LOGIN_PATH } from '../../enums/routes';
import { saveCustomToken, loadCustomToken, deleteCustomToken } from '../../Storage/localStorage';

import { LoginContainer } from './index.style';
import LoginForm from './loginForm';

export class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    // this.getURLTab = this.getURLTab.bind(this)
  }

  state = {
    custom_token: ''
  };

  componentWillMount() {
    if (this.getURLTab() === LOGIN_PATH) {
      deleteCustomToken();
    }
    let custom_token = loadCustomToken();
    const isTokenValid = this.checkForValidityOfAccessToken(custom_token);
    if (!isTokenValid) {
      custom_token = '';
    }
    if (this.getURLTab() !== LOGIN_PATH && !custom_token) {
      this.props.history.push('/login');
    }
    this.setState({
      custom_token
    });
    this.props.history.listen(() => {
      custom_token = loadCustomToken();
      this.setState({ custom_token });
    });
  }

  async onLoginSuccess({ custom_token }) {
    this.props.history.push('/app');
    saveCustomToken(custom_token);
    this.setState({
      custom_token
    });
  }

  getURLTab() {
    return this.props.history.location.pathname.split('/')[1];
  }

  checkForValidityOfAccessToken(custom_token) {
    if (!custom_token) {
      return false;
    }
    const { exp } = decode(custom_token);
    if (exp) {
      const expiry = parseInt(exp) * 1000;
      const currentTime = new Date().getTime();
      return currentTime < expiry;
    }
    return false;
  }

  render() {
    return this.getURLTab() === LOGIN_PATH || !this.state.custom_token ? (
      <LoginContainer>
        <LoginForm onLoginSuccess={this.onLoginSuccess} />
      </LoginContainer>
    ) : (
      <div>{this.props.children}</div>
    );
  }
}
