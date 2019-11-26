import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MuiThemProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import themeFile from './util/theme'
import jwtDecode from 'jwt-decode'

//Redux
import { Provider } from 'react-redux';
import store from './redux/store';

//component
import Navbar from './components/Navbar';
import AuthRoute from './util/AuthRoute'

import home from './pages/home';
import login from './pages/login'
import signup from './pages/signup'


const theme = createMuiTheme(themeFile);

let authenticated;
const token = localStorage.FBIdToken;
if(token) {
  const decodeToken = jwtDecode(token);
  if(decodeToken.exp * 1000 < Date.now()) {
    window.location.href = '/login'
    authenticated = false;
  }else {
    authenticated = true
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <div className="container">
              <Navbar />
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} authenticated={authenticated}/>
                <AuthRoute exact path="/signup" component={signup} authenticated={authenticated}/>
              </Switch>
            </div>
          </Router >
        </Provider>
      </MuiThemProvider>
    )
  }
}

export default App;
