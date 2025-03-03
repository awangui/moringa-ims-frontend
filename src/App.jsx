import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import SpacesPage from './pages/spaces'; 
import EditSpace from './pages/EditSpace';
import ViewRoom from './pages/ViewRoom';
import AddRoom from './pages/AddRoom';
import RequestsPage from './pages/Requests';

function App() {
  const [spaces, setSpaces] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigation><h1>Welcome to the Dashboard</h1></Navigation>} />
        <Route path="/spaces" element={<SpacesPage spaces={spaces} setSpaces={setSpaces} />} />
        <Route path="/editSpace/:id" element={<EditSpace spaces={spaces} setSpaces={setSpaces} />} />
        <Route path="/ViewRoom/:id" element={<ViewRoom spaces={spaces} setSpaces={setSpaces} />} />
        <Route path="/AddRoom" element={<AddRoom spaces={spaces} setSpaces={setSpaces}/>} />
        <Route path="/requests" element={<RequestsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
