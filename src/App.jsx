/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import SpacesPage from './pages/spaces';
import EditSpace from './pages/EditSpace';
import ViewRoom from './pages/ViewRoom';
import AddRoom from './pages/AddRoom';
import RequestsPage from './pages/Requests';
import MultiStepForm from './components/Vendors-form/Multiform';
import Vendors from './pages/Vendors';
import ViewVendor from './components/ViewVendor';
import EditVendor from './components/EditVendor';
import UploadDocuments from './components/UploadDocuments';

import { OrdersList, ViewOrder } from './pages/OrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';
import CreateOrderStep2 from './pages/CreateOrderStep2';
import { ChooseItems, ChooseVendor, OrderDetails, OrderCharges, OrderReview } from './pages/CreateOrderStep3';
import { SidebarProvider } from './components/ui/sidebar';
import AssignRequests from './pages/AssignRequests';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import FixedAssets from './pages/FixedAssets';
import AssetDetails from './pages/AssetDetails';
import Dashboard from './pages/Dashboard';


function App() {
  const [spaces, setSpaces] = useState([]);

  return (
    <SidebarProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/spaces" element={<SpacesPage spaces={spaces} setSpaces={setSpaces} />} />
            <Route path="/editSpace/:id" element={<EditSpace spaces={spaces} setSpaces={setSpaces} />} />
            <Route path="/ViewRoom/:id" element={<ViewRoom spaces={spaces} setSpaces={setSpaces} />} />
            <Route path="/AddRoom" element={<AddRoom spaces={spaces} setSpaces={setSpaces} />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/AssignRequests" element={<AssignRequests />} />



            {/* Vendors */}
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendors/create-vendor" element={<MultiStepForm />} />
            <Route path="/vendors/:id" element={<ViewVendor />} />
            <Route path="/vendors/edit/:id" element={<EditVendor />} />
            <Route path="/vendors/:id/documents" element={<UploadDocuments />} />

            {/* Orders */}
            <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:id" element={<ViewOrder />} />
            <Route path="/create-order" element={<CreateOrderPage />} />
            <Route path="/create-order/step1" element={<CreateOrderPage />} />
            <Route path="/create-order/step2" element={<CreateOrderStep2 />} />

            {/* Step 3 - Order Configuration */}
            <Route path="/create-order/step3" element={<Navigate to="/create-order/step3/items" replace />} />
            <Route path="/create-order/step3/items" element={<ChooseItems />} />
            <Route path="/create-order/step3/vendor" element={<ChooseVendor />} />
            <Route path="/create-order/step3/details" element={<OrderDetails />} />
            <Route path="/create-order/step3/charges" element={<OrderCharges />} />
            <Route path="/create-order/step3/review" element={<OrderReview />} />

            {/* Fixed Assets */}
            <Route path="/items" element={<FixedAssets />} />
            <Route path="/asset-details/:assetId" element={<AssetDetails />} />
          </Route>

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

    </SidebarProvider>

  );
}

export default App;
