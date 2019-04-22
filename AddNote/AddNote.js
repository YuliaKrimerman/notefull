import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
//import config from '../config'
import './AddNote.css'
import ValidationError from "./ValidationError";

export default class AddNote extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameValid: false,
      validationMessage: ''
    };
  }

  static contextType = ApiContext

  static defaultProps = {
    history: {
      push: () => {}
    }
  };

  updateName(name) {
    this.setState({
      name
    }, () => this.validateName(name));
  }

  validateName(fieldValue) {
    let fieldErrors = this.state.validationMessage;
    let hasError = false;

    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors = 'Name is required';
      hasError = true;
    } else {
      fieldErrors = '';
      hasError = false;
    }

    this.setState({
      validationMessage: fieldErrors,
      nameValid: !hasError
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const note = {
      name: e.target['note-name-input'].value,
      content: e.target['note-content-input'].value,
      folderId: e.target['note-folder-select'].value,
      modified: new Date()
    };

    fetch('http://localhost:9090/notes', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(note),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } throw new Error(response.statusText);
    })
    .then(note => {
      this.context.addNote(note);
      this.props.history.push(`/folder/${note.folderId}`);
    })
    .catch(error => console.error({error}))
  }

  render() {
    const { folders } = this.context;
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' onChange={e => this.updateName(e.target.value)} />
            <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessage} />
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select'>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.nameValid}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}