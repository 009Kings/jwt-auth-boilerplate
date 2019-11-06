import React from 'react';
import logo from './logo.svg';
import Signup from './Signup';
import Login from './Login';
import axios from 'axios';
import './App.css';

// Helper function
let burnItDown = () => {
  
}

class App extends React.Component {
  state = {
    token: '',
    user: null,
    errorMessage: '',
    lockedResult: ''
  }

  checkForLocalToken = () => {
    let token = localStorage.getItem('mernToken')
    if (!token || token === 'undefined') {
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      axios.post('/auth/me/from/token', {token})
      .then(response => {
        if (response.data.type === 'error') {
          localStorage.removeItem('mernToken')
          this.setState({
            token: '',
            user: null
          })
          console.log(`💩: ${response.data.message}`)
        } else {
          localStorage.setItem('mernToken', response.data.token)
          this.setState({
            token: response.data.token,
            user: response.data.user
          })
        }
      })
    }
  }

  componentDidMount = () => {
    this.checkForLocalToken()
  }

  liftToken = ({token, user}) => {
    this.setState({
      token,
      user
    })
  }

  logout = () => {
    localStorage.removeItem('mernToken')
    this.setState({
      token: '',
      user: null
    })
  }

  handleClick = () => {
    let config = {
      headers: {
        Authorization: `Bearer ${this.state.token}`
      }
    }
    axios.get('/locked/test', config).then(response => {
      this.setState({
        lockedResult: response.data.message
      })
    })
  }

  render() {
    let contents;
    if (this.state.user) {
      contents = (
        <>
          <p>Hello {this.state.user.name}</p>
          <button onClick={this.handleClick}>Test the protected Route</button><br />
          <button onClick={this.logout}>LOGOUT</button>
          <p>{this.state.lockedResult}</p>
        </>
      )
    } else {
      contents = (
      <>
        <Signup liftToken={this.liftToken} />
        <Login liftToken={this.liftToken} />
      </>
      )
    }

    return (
      <div className="App">
        <header>
          <h1>Welcome to my Site!</h1>
        </header>
        <main>
          {contents}
        </main>
      </div>
    )
  }

}

export default App;
