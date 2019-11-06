import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    message: '',
  }

  handleChange = e => this.setState({
    [e.target.name]: e.target.value
  })

  handleSubmit = e => {
    e.preventDefault();
    axios.post('/auth/login', {
      email: this.state.email,
      password: this.state.password
    }).then(response => {
      if (response.data.type === 'error') {
        console.log(response.data.message)
        // TODO Put this message in state
        this.setState({ message: response.data.message })
      } else {
        localStorage.setItem('mernToken', response.data.token)
        this.props.liftToken(response.data)
      }
    }).catch(err => console.log(`💩: ${err}`)) // This block catches rate limiter errors
  }

  render() {
    return (
      <div className="login">
        <h3>Login</h3>
        <form onSubmit={this.handleSubmit}>
          Email:
          <input type="text" name="email" onChange={this.handleChange} value={this.state.email} /><br />
          Password:
          <input type="password" name="password" onChange={this.handleChange} value={this.state.password} /><br />
          <input type="submit" value="Log in"/><br />
        </form>
      </div>
    )
  }

}

export default Login;