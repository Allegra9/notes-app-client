// eslint-disable-next-line
import React, { Component } from "react";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
// import styled from "@emotion/styled";
class Home extends Component {
  render() {
    return (
      <div css={container}>
        <div css={content}>
          <h1>Otter notes</h1>
          <p>Simply take notes</p>
        </div>
      </div>
    );
  }
}
export default Home;

const container = css`
  padding: 80px 0;
  text-align: center;
  font-family: "Open Sans", sans-serif;
`;

const content = css`
  h1 {
    font-weight: 600;
  }
  p {
    color: #999;
  }
`;
