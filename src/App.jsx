import React from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from "./Editor";

function App() {
  return (
    <div className="App">
        <Editor />
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
