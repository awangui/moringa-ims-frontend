import './App.css'
import MultiStepForm from './components/Vendors-form/Multiform';
import Vendors from './pages/Vendors'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VendorProvider } from './pages/VendorContext';
import ViewVendor from './components/ViewVendor';
import EditVendor from './components/EditVendor';
import UploadDocuments from './components/UploadDocuments';
import Navigation from './components/Navigation';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/create-vendor" element={<MultiStepForm />} />
          <Route path="/vendors/:id" element={<ViewVendor />} />
          <Route path="/vendors/edit/:id" element={<EditVendor />} />
          <Route path="/vendors/:id/documents" element={<UploadDocuments />} />
        </Routes>
      </Router>
  );
}

export default App
