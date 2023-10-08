import './App.css';
import {Route, Routes} from 'react-router-dom'
import Layout from './components/Layout'
import Note from './components/Note'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="create-note" element={<Note/>} />
      </Route>
    </Routes>
  );
}

export default App;
