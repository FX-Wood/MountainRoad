import React, { Component } from 'react';
import axios from 'axios';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import { withSnackbar } from 'notistack';

// Pages
import Splash from './views/Splash';
import SignupFlow from './views/SignupFlow';
import LoginFlow from './views/LoginFlow';
import Dash from './views/Dash';

// material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './utilities/theme';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      user: null,
      message: '',
      lockedResult: '',
      login: false,
      signup: false
    }
    this.handleButton = this.handleButton.bind(this)
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.liftMessageToState = this.liftMessageToState.bind(this)
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
    this.logout = this.logout.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  handleButton(button) {
    console.log('handling button ', button)
    switch(button) {
      case 'signup':
        this.setState({
            signup: true,
            login: false
        })
        break;
      case 'login':
        this.setState({
            login: true,
            signup: false,
        })
        break;
    }
  }

  liftTokenToState({token, user, message}) {
    console.log('[App.jsx]: lifting token to state', {token, user, message})
    this.setState({token, user, message})
  }

  liftMessageToState({ message }) {
    console.log('[App.jsx]: lifting error to state', { message })
    this.setState({ message })
    this.props.enqueueSnackbar(message)

  }

  logout() {
    console.log('[App.jsx] logout(): logging out', {localStorage: localStorage})
    // Remove the token from localStorage
    localStorage.removeItem('jwtToken')
    // Remove the user and token from state
    this.setState({
      token: '',
      user: null
    })
  }

  handleClick(e) {
    console.log('[App.jsx]: handleClick(), event', {e})
    console.log('[App.jsx]: handleClick(), this.state', this.state)
    e.preventDefault()
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.token}`
    axios.get('/locked/test').then( res => {
      console.log('this is the locked response', res)
      this.setState({
        lockedResult: res.data.message
      })
    }).catch(err => {
      console.log('err')
    })
  }

  checkForLocalToken() {
    console.log('[App.jsx]: checkForLocalToken(), localStorage["jwtToken"]', localStorage["jwtToken"])
    let token = localStorage.getItem('jwtToken')
    if (!token || token === 'undefined') {
      // If there is no token, remove the entry in localStorage
      localStorage.removeItem('jwtToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      // If found, send token to be verified
      axios.post('/auth/me/from/token',{token})
      .then( res => {
        if (res.data.type === 'error') {
          console.log('there was an older token sir, and it didn\'t check out', res.data)
          // if error, remove the bad token and display an error
          localStorage.removeItem('jwtToken')
          this.setState({
            errorMessage: res.data.message
          })
        } else {
          // Upon receipt, store token 
          localStorage.setItem('jwtToken', res.data.token)
          // Put token in state
          this.setState({
            token: res.data.token,
            user: res.data.user
          })
        }
        console.log(res)
        this.props.history.push('/dash')
      }).catch( err => {
        console.log(err)
        this.props.enqueueSnackbar(err, {type: 'error'})
      })
    }
  }

  componentDidMount() {
    console.log('[App.jsx]: componentDidMount(), this.state', JSON.stringify(this.state) )
    this.checkForLocalToken()
  }

  render() {
    console.log(theme)
    let user = this.state.user

    const authProps = {
      toggleForm: this.handleButton,
      liftToken: this.liftTokenToState,
      liftMessage: this.liftMessageToState
    }
    return (
      <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <Route 
              exact path='/'
              render={() => <Splash user={user} />} />
            <Route 
              path="/signup" 
              render={() => <SignupFlow {...authProps} />} />
            <Route 
              exact path="/login" 
              render={() => <LoginFlow {...authProps}/>} />
            <Route
              path="/dash" render={() => <Dash user={user} logout={this.logout} /> } />
          </Switch>
      </MuiThemeProvider>
    )
  }
}

export default withSnackbar(App);
