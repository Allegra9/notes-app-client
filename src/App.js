// eslint-disable-next-line
import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import Routes from "./Routes";
import { Navbar, Nav, NavItem } from "react-bootstrap";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
// import styled from "@emotion/styled";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <span css={navbar}>
                <Link to="/">Otter notes</Link>
              </span>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <LinkContainer to="/signup">
                <NavItem>Signup</NavItem>
              </LinkContainer>
              <LinkContainer to="/login">
                <NavItem>Login</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Routes />
      </React.Fragment>
    );
  }
}

export default App;

const navbar = css`
  margin: 10px;
  margin-bottom: 0;
  font-weight: bold;
  font-size: 30px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
  a {
    color: #000;
    text-decoration: none;
  }
`;
