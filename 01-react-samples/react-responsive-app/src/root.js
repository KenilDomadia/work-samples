import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory as createHistory } from 'history';
import theme from './themes';
import { LoginPage } from './views/login';
import { App } from './views/app';

export const history = createHistory({});

const Root = () => (
  <ThemeProvider theme={theme}>
    <Router history={history}>
      <LoginPage history={history}>
        <Redirect exact from="/" to="/app" />
        <Switch>
          <Route exact path="/app" component={() => <App history={history} />} />
        </Switch>
      </LoginPage>
    </Router>
  </ThemeProvider>
);
export default Root;
