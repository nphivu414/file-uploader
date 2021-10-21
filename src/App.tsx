import React from 'react';
import logo from './logo.svg';
import './App.css';
import FileUploader from './components/FileUploader';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          File Uploader Sample
        </a>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
          <FileUploader/>
        </div>
      </header>
    </div>
  );
}

export default App;
