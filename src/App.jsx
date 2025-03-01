import './App.css'
import MultiStepForm from './components/Vendors-form/Multiform';
import Vendors from './pages/Vendors'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VendorProvider } from './pages/VendorContext';
import ViewVendor from './components/ViewVendor';

function App() {
  return (
    <VendorProvider>
    <Router>
        <Routes>
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/create-vendor" element={<MultiStepForm />} />
          <Route path="/vendors/view-vendor" element={<ViewVendor />} />

        </Routes>
    </Router>
    </VendorProvider>
  )
}

export default App
