import './App.css';
import {Route, Routes} from 'react-router-dom'
import React from 'react'
import Layout from './components/Layout'
import Note from './components/Note'
import NoteView from './components/NoteView'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="create-note" element={<Note />} />
        <Route path="view-note/:id" element={<NoteView />} />
      </Route>
    </Routes>
  );
}

export default App;