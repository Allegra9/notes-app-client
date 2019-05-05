// eslint-disable-next-line
import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { API } from "aws-amplify";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
// import styled from "@emotion/styled";
export default class Home extends Component {
  state = {
    isLoading: true,
    notes: []
  };

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const notes = await this.notes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  notes() {
    return API.get("notes", "/notes");
  }

  renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  renderLander() {
    return (
      <div css={container}>
        <div css={content}>
          <h1>Otter notes</h1>
          <p>Simply take notes</p>
        </div>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div css={notes}>
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}

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
const notes = css`
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  h4 {
    font-family: "Open Sans", sans-serif;
    font-weight: 600;
    overflow: hidden;
    line-height: 1.5;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  p {
    color: #666;
    font-size: 0.9em;
  }
`;
