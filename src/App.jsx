import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import SpacesPage from './pages/spaces'; 
import EditSpace from './pages/EditSpace';
import ViewRoom from './pages/ViewRoom';
import AddRoom from './pages/AddRoom';
import RequestsPage from './pages/Requests';
import './App.css'
import MultiStepForm from './components/Vendors-form/Multiform';
import Vendors from './pages/Vendors'
import { VendorProvider } from './pages/VendorContext';
import ViewVendor from './components/ViewVendor';
import EditVendor from './components/EditVendor';
import UploadDocuments from './components/UploadDocuments';

function App() {
  const [spaces, setSpaces] = useState([]);

  return (
    <VendorProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigation><h1>Welcome to the Dashboard</h1></Navigation>} />
          <Route path="/spaces" element={<SpacesPage spaces={spaces} setSpaces={setSpaces} />} />
          <Route path="/editSpace/:id" element={<EditSpace spaces={spaces} setSpaces={setSpaces} />} />
          <Route path="/ViewRoom/:id" element={<ViewRoom spaces={spaces} setSpaces={setSpaces} />} />
          <Route path="/AddRoom" element={<AddRoom spaces={spaces} setSpaces={setSpaces}/>} />
          <Route path="/requests" element={<RequestsPage/>} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/create-vendor" element={<MultiStepForm />} />
          <Route path="/vendors/:id" element={<ViewVendor />} />
          <Route path="/vendors/edit/:id" element={<EditVendor />} />
          <Route path="/vendors/:id/documents" element={<UploadDocuments />} />
        </Routes>
      </Router>
    </VendorProvider>
  );
}

export default App;
