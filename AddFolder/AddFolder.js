import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import './AddFolder.css'

export default class AddFolder extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    history: {
      push: () => {}
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const folder = {
      name: e.target['folder-name'].value
    };
    fetch('http://localhost:9090/folders', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(folder),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } throw new Error(response.statusText);
    })
    .then(folder => {
      this.context.addFolder(folder)
      this.props.history.push(`/folder/${folder.id}`)
    })
    .catch(error => console.error({error}))
  }

  render() {

    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name="folder-name" />
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}