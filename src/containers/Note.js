// eslint-disable-next-line
import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderBtn";
import { s3Upload } from "../libs/awsLib";
import config from "../config";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
export default class Note extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: "",
      attachmentURL: null,
      editNote: false
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const note = await this.getNote();
      const { content, attachment } = note;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        note,
        content,
        attachmentURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleEdit = () => {
    this.setState({
      editNote: true
    });
  };

  handleCancelEdit = () => {
    this.setState({
      editNote: false
    });
  };

  handleFileChange = event => {
    this.file = event.target.files[0];
  };

  saveNote(note) {
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }

  handleSubmit = async event => {
    let attachment;
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
      }

      await this.saveNote({
        content: this.state.content,
        attachment: attachment || this.state.note.attachment
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  deleteNote() {
    return API.del("notes", `/notes/${this.props.match.params.id}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteNote();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  };

  render() {
    const { content } = this.state;
    console.log(this.state);
    return (
      <div css={page}>
        <div css={container}>
          {this.state.note && this.state.editNote ? (
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="content">
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.content}
                  componentClass="textarea"
                />
              </FormGroup>
              {this.state.note.attachment && (
                <FormGroup>
                  <ControlLabel>Attachment</ControlLabel>
                  <FormControl.Static>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={this.state.attachmentURL}
                    >
                      {this.formatFilename(this.state.note.attachment)}
                    </a>
                  </FormControl.Static>
                </FormGroup>
              )}
              <FormGroup controlId="file">
                {!this.state.note.attachment && (
                  <ControlLabel>Attachment</ControlLabel>
                )}
                <FormControl onChange={this.handleFileChange} type="file" />
              </FormGroup>
              <CancelBtn onClick={this.handleCancelEdit}>Cancel</CancelBtn>
              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Save"
                loadingText="Saving…"
              />
              <LoaderButton
                block
                bsStyle="danger"
                bsSize="large"
                isLoading={this.state.isDeleting}
                onClick={this.handleDelete}
                text="Delete"
                loadingText="Deleting…"
              />
            </form>
          ) : content ? (
            <NoteContainer>
              <span>{content}</span>
              <span css={editBtn} onClick={this.handleEdit}>
                Edit
              </span>
              {this.state.note.attachment && (
                <FormGroup>
                  <br />
                  <ControlLabel>Attachment</ControlLabel>
                  <FormControl.Static>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={this.state.attachmentURL}
                    >
                      <img src={this.state.attachmentURL} alt="" />
                      {this.formatFilename(this.state.note.attachment)}
                    </a>
                  </FormControl.Static>
                </FormGroup>
              )}
            </NoteContainer>
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    );
  }
}

const page = css`
  width: 100%;
  height: 100vh;
`;

const container = css`
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  margin-top: 0;
  form {
    padding-bottom: 15px;
    textarea {
      height: 300px;
      font-size: 24px;
    }
  }
  button {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
`;
const NoteContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px;
  padding: 20px 10px;
`;
const editBtn = css`
  color: #38cce2;
  cursor: pointer;
  text-align: right;
  padding-right: 10px;
`;
const CancelBtn = styled.div`
  border: 1px solid grey;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.2em;
  text-align: center;
  cursor: pointer;
  margin-bottom: 5px;
  padding: 8px 0;
  border-radius: 5px;
`;
