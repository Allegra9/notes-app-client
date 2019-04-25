// eslint-disable-next-line
import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderBtn";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
// import styled from "@emotion/styled";

class Login extends Component {
  state = {
    email: "",
    password: "",
    isLoading: false
  };

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      console.log(e.message);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { email, password } = this.state;
    return (
      <div css={container}>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </div>
    );
  }
}

export default Login;

const container = css`
  width: 90%;
  margin-left: auto;
  margin-right: auto;

  @media all and (min-width: 480px) {
    padding: 60px 0px;
    form {
      margin: 0 auto;
      max-width: 320px;
    }
  }
`;
