/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, useParams } from 'react-router-dom';
// CSS Modules
import styles from './CreateOrderStep3.module.css';
import stepperStyles from './OrderStepper.module.css';
import detailsStyles from './OrderDetails.module.css';
import chargesStyles from './OrderCharges.module.css';
import reviewStyles from './OrderReview.module.css';
import {
  Button,
} from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { getVendors } from '../lib/api';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { 
  ArrowLeft, 
  Bell, 
  Clock, 
  Users, 
  ShoppingCart, 
  FileText, 
  Package, 
  MessageSquare, 
  User, 
  Settings, 
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Sidebar } from '@/components/ui/sidebar';
import { createOrder } from '../lib/api'; // Adjust the path as needed



// Common header for all steps
const Header = ({ title }) => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        {title}
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
      </div>
    </div>
  );
};

// Common stepper component for navigation
const OrderStepper = ({ currentStep }) => {
  const navigate = useNavigate();
  const steps = [
    { id: "add-items", label: "ADD ITEMS", icon: <ShoppingCart size={16} /> },
    { id: "add-order-details", label: "ADD ORDER DETAILS", icon: <Package size={16} /> },
    { id: "add-order-charges", label: "ADD ORDER CHARGES", icon: <MessageSquare size={16} /> },
    { id: "view-order", label: "VIEW ORDER", icon: <User size={16} /> }
  ];

  const handleCancel = () => {
    navigate('/orders');
  };

  return (
    <div className={stepperStyles.stepper}>
      {steps.map((step, index) => (
        <div 
          key={step.id} 
          className={`${stepperStyles.step} ${
            index === currentStep ? stepperStyles.stepActive : stepperStyles.stepInactive
          } ${index < currentStep ? stepperStyles.stepDisabled : ""}`}
          style={{ flex: 1 }}
        >
          <div className="flex items-center gap-2">
            {step.icon}
            <span className="text-xs font-medium">{step.label}</span>
          </div>
        </div>
      ))}
      <button onClick={handleCancel}>
        <div className={stepperStyles.cancelButton}>
          <X size={16} />
          <span className="ml-1 text-xs font-medium">CANCEL</span>
        </div>
      </button>
    </div>
  );
};

// Pagination component
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className={styles.pagination}>
      <div className="text-sm text-gray-500">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <select 
            className="bg-white border rounded px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => onPageChange(1, parseInt(e.target.value))}
          >
            <option value={10}>10 entries per page</option>
            <option value={25}>25 entries per page</option>
            <option value={50}>50 entries per page</option>
          </select>
        </div>
        <div className="flex">
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full border"
            onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {pages.map(page => (
            <button 
              key={page}
              className={`w-8 h-8 flex items-center justify-center rounded-full ml-1 ${
                page === currentPage ? "bg-orange-500 text-white" : "border"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full border ml-1"
            onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};


// Step 3: Choose Items
const ChooseItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, description, items = [] } = location.state || {};
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sample items for selection
  const availableItems = [
    { id: 1, name: "Chairs", category: "Furniture",  quantity: 50, unitCost: "Kshs 3,000" },
    { id: 2, name: "Laptops", category: "Electronics",  quantity: 30, unitCost: "Kshs 40,000" },
    { id: 3, name: "Tables", category: "Furniture",  quantity: 20, unitCost: "Kshs 8,000" },
    { id: 4, name: "CCTV Cameras", category: "Electronics",  quantity: 5, unitCost: "Kshs 15,000" },
    { id: 5, name: "Water Dispensers", category: "Appliances",  quantity: 15, unitCost: "Kshs 9,000" },
  ];
  
  const handleBack = () => {
    navigate('/create-order/step2', { 
      state: { 
        name, 
        description, 
        items 
      } 
    });
  };
  
  const handleContinue = () => {
    // Add selected items to the order
    const updatedItems = [...items, ...selectedItems];
    navigate('/create-order/step3/vendor', { 
      state: { 
        name, 
        description, 
        items: updatedItems 
      } 
    });
  };
  
  const toggleItemSelection = (item) => {
    if (selectedItems.some(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handlePageChange = (page, pageSize = itemsPerPage) => {
    setCurrentPage(page);
    if (pageSize !== itemsPerPage) {
      setItemsPerPage(pageSize);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      {/* Main Content */}
      <div className={styles.content}>
        <Header title="Creating Order Step 3" />

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.maxWidth}>
            {/* Title */}
            <div className="flex justify-between items-center mb-4">
              <h1 className={styles.title}>Choose Items</h1>
              <div className="text-right">
                <Bell size={24} />
              </div>
            </div>

            {/* Stepper */}
            <OrderStepper currentStep={0} />

            {/* Search Bar */}
            <div className="my-6">
              <div className="relative">
                <Search className={styles.searchIcon} />
                <Input
                  type="text"
                  placeholder="Search"
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Items Table */}
            <div className={styles.tableContainer}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>ITEM NAME</TableHead>
                    <TableHead>CATEGORY</TableHead>
                    <TableHead>QUANTITY</TableHead>
                    <TableHead>UNIT COST</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableItems.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className={selectedItems.some(i => i.id === item.id) ? "bg-indigo-50" : ""}
                      onClick={() => toggleItemSelection(item)}
                    >
                      <TableCell>
                        <Checkbox 
                          checked={selectedItems.some(i => i.id === item.id)}
                          onCheckedChange={() => toggleItemSelection(item)}
                        />
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unitCost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalItems={57}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                className="flex items-center text-gray-600"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Button>
              
              <Button 
                className="bg-black text-white hover:bg-gray-800"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ChooseVendor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, description, items = [] } = location.state || {};
  
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState([]); // State to store vendors
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  // Fetch vendors from the API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getVendors(); // Fetch vendors
        setVendors(data); // Set the fetched vendors
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchVendors();
  }, []);

  const handleBack = () => {
    navigate('/create-order/step3/items', {
      state: { name, description, items }
    });
  };
  
  const handleContinue = () => {
    if (!selectedVendor) {
      alert('Please select a vendor before continuing.');
      return;
    }
  
    console.log('Selected vendor:', selectedVendor); // Add this for debugging
  
    navigate('/create-order/step3/details', {
      state: { name, description, items, vendor: selectedVendor }
    });
  };

  if (loading) return <div>Loading vendors...</div>; // Show loading message
  if (error) return <div>Error: {error}</div>; // Show error message

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Header title="Choose Vendor" />
        <div className={styles.mainContent}>
          <div className={styles.maxWidth}>
            <h1 className={styles.title}>Choose a Vendor</h1>
            <div className={styles.tableContainer}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>
                        <Checkbox 
                          checked={selectedVendor?.id === vendor.id}
                          onCheckedChange={() => setSelectedVendor(vendor)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="outline" className="flex items-center text-gray-600" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> BACK
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 5: Enter Purchase Order Details
const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, description, items = [], space, vendor } = location.state || {};
  
  const [orderDetails, setOrderDetails] = useState({
    vat: "",
    vatInclusive: false,
    status: "Pending",
    receivingDate: "22/03/2022",
    isPaid: false,
    sent: false
  });
  
  const handleBack = () => {
    navigate('/create-order/step3/vendor', { 
      state: { 
        name, 
        description, 
        items,
        space
      } 
    });
  };
  
  const handleContinue = () => {
    navigate('/create-order/step3/charges', { 
      state: { 
        name, 
        description, 
        items,
        space,
        orderDetails,
        vendor
      } 
    });
  };
  
  const handleChange = (field, value) => {
    setOrderDetails({
      ...orderDetails,
      [field]: value
    });
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      {/* Main Content */}
      <div className={styles.content}>
        <Header title="Create Order Step 5" />

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.maxWidth}>
            {/* Title */}
            <div className="flex justify-between items-center mb-4">
              <h1 className={styles.title}>Enter Purchase Order Details</h1>
            </div>

            {/* Stepper */}
            <OrderStepper currentStep={2} />

            {/* Order Details Form */}
            <div className={detailsStyles.card}>
              <CardContent className={detailsStyles.cardContent}>
                <div className={detailsStyles.orderDetails}>
                  <div>
                    <h2 className={detailsStyles.orderDetailsTitle}>Order Details</h2>
                    <div className={detailsStyles.orderDetailsContent}>
                      <div>
                        <span className={detailsStyles.orderDetailsLabel}>Name:</span>
                        <span className={detailsStyles.orderDetailsValue}>{name}</span>
                      </div>
                      <div>
                        <span className={detailsStyles.orderDetailsLabel}>Description:</span>
                        <span className={detailsStyles.orderDetailsValue}>{description}</span>
                      </div>
                      <div>
                        <span className={detailsStyles.orderDetailsLabel}>Space:</span>
                        <span className={detailsStyles.orderDetailsValue}>{space?.name || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className={detailsStyles.orderDetailsLabel}>Status:</span>
                        <span className={detailsStyles.orderDetailsValue}>{orderDetails?.status || 'Pending'}</span>
                      </div>
                      <div>
                        <span className={detailsStyles.orderDetailsLabel}>Receiving Date:</span>
                        <span className={detailsStyles.orderDetailsValue}>{orderDetails?.receivingDate || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12">
              <Button 
                className="w-full bg-indigo-900 text-white hover:bg-indigo-800"
                onClick={handleContinue}
              >
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Back Button */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="flex items-center text-gray-600"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 6: Add Order Charges
const OrderCharges = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, description, items = [], space, orderDetails, vendor } = location.state || {};
  
  const [charges, setCharges] = useState([]);
  const [newCharge, setNewCharge] = useState({
    amount: "",
    reason: "",
    type: "admin",
    info: ""
  });
  
  const handleBack = () => {
    navigate('/create-order/step3/details', { 
      state: { 
        name, 
        description, 
        items,
        space,
        orderDetails
      } 
    });
  };
  
  const handleContinue = () => {
    navigate('/create-order/step3/review', { 
      state: { 
        name, 
        description, 
        items,
        space,
        orderDetails,
        charges,
        vendor
      } 
    });
  };
  
  const handleChange = (field, value) => {
    setNewCharge({
      ...newCharge,
      [field]: value
    });
  };

  const handleAddCharge = () => {
    if (newCharge.amount && newCharge.reason) {
      setCharges([...charges, { ...newCharge, id: Date.now() }]);
      setNewCharge({
        amount: "",
        reason: "",
        type: "admin",
        info: ""
      });
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      {/* Main Content */}
      <div className={styles.content}>
        <Header title="Create Purchase Order" />

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.maxWidth}>
            {/* Title */}
            <div className="flex justify-between items-center mb-4">
              <h1 className={styles.title}>Create Purchase Order</h1>
            </div>

            {/* Stepper */}
            <OrderStepper currentStep={3} />

            {/* Charges Form */}
            <div className={chargesStyles.chargesForm}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input 
                    id="amount" 
                    placeholder="Enter amount" 
                    value={newCharge.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Input 
                    id="reason" 
                    placeholder="Enter reason" 
                    value={newCharge.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={newCharge.type} 
                    onValueChange={(value) => handleChange('type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">admin</SelectItem>
                      <SelectItem value="shipping">shipping</SelectItem>
                      <SelectItem value="tax">tax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="info">Info</Label>
                  <Input 
                    id="info" 
                    placeholder="Enter info" 
                    value={newCharge.info}
                    onChange={(e) => handleChange('info', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Add Charge Button */}
              <div className="mt-8">
                <Button 
                  className="w-full bg-indigo-900 text-white hover:bg-indigo-800"
                  onClick={handleAddCharge}
                >
                  Add charge
                </Button>
              </div>
            </div>

            {/* Charges List (if we have any) */}
            {charges.length > 0 && (
              <div className={chargesStyles.chargesList}>
                <h2 className="text-lg font-medium mb-4">Added Charges</h2>
                <div className={chargesStyles.chargesTable}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>AMOUNT</TableHead>
                        <TableHead>REASON</TableHead>
                        <TableHead>TYPE</TableHead>
                        <TableHead>INFO</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {charges.map((charge) => (
                        <TableRow key={charge.id}>
                          <TableCell>{charge.amount}</TableCell>
                          <TableCell>{charge.reason}</TableCell>
                          <TableCell>{charge.type}</TableCell>
                          <TableCell>{charge.info}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                className="flex items-center text-gray-600"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Button>
              
              <Button 
                className="bg-indigo-900 text-white hover:bg-indigo-800"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Final View: Order Review and Save
const OrderReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, description, items = [], space, orderDetails, charges = [], vendor } = location.state || {};

  console.log('Order review location state:', location.state);
  console.log('Vendor in state:', vendor);
  
  const handleBack = () => {
    navigate('/create-order/step3/charges', { 
      state: { 
        name, 
        description, 
        items,
        space,
        orderDetails,
        charges
      } 
    });
  };
  
  const handleSaveOrder = async () => {
    // Calculate total cost from items
    const totalCost = items.reduce((sum, item) => {
      const costString = item.unitCost.replace('Kshs ', '').replace(',', '');
      const cost = parseFloat(costString) || 0;
      return sum + (cost * item.quantity);
    }, 0);
  
    // Get the vendor ID (try multiple ways to locate it)
    const vendorId = vendor?.id || location.state?.vendor?.id;
    
    console.log('Vendor data:', vendor);
    console.log('Trying to use vendor ID:', vendorId);
  
    // Prepare the order data to send to the backend
    const orderData = {
      order_name: name || "Unnamed Order",
      order_description: description || "No description",
      name: items[0]?.name || "Unnamed Item",
      cost: totalCost,
      vendor_id: vendorId, // Use the vendor ID we extracted
      vat: orderDetails?.vat || 19.99,
      quantity: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
      status: orderDetails?.status || "Pending",
      date_ordered: new Date().toISOString().split('T')[0],
      payment_status: orderDetails?.isPaid ? "Paid" : "Unpaid",
      dispatch_status: orderDetails?.sent ? "Sent" : "Processing",
      delivery_charges: charges.reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0),
      reason: "driver lunch",
      initialiser: "Admin",
    };
  
    console.log('Order data being sent:', orderData);
    
    // If vendor_id is still undefined, show an error
    if (!orderData.vendor_id) {
      alert('Vendor ID is missing. Please go back and select a vendor.');
      return;
    }
  
    try {
      // Call the createOrder API
      const response = await createOrder(orderData);
      console.log('Order created:', response);
      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  // Calculate total order value
  const calculateTotal = () => {
    // Calculate items total
    const itemsTotal = items.reduce((sum, item) => {
      const costString = item.unitCost.replace('Kshs ', '').replace(',', '');
      const cost = parseFloat(costString) || 0;
      return sum + (cost * item.quantity);
    }, 0);
    
    // Add charges
    const chargesTotal = charges.reduce((sum, charge) => {
      return sum + (parseFloat(charge.amount) || 0);
    }, 0);
    
    return (itemsTotal + chargesTotal).toLocaleString();
  };
  
  return (
    <div className={styles.container}>
      <Sidebar />
      {/* Main Content */}
      <div className={styles.content}>
        <Header title="View Order" />
        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.maxWidth}>
            {/* Title */}
            <div className="flex justify-between items-center mb-4">
              <h1 className={styles.title}>View Order</h1>
            </div>
            {/* Stepper */}
            <OrderStepper currentStep={4} />
            
            {/* Order Summary Card */}
            <Card className={reviewStyles.orderSummary}>
              <CardContent className={reviewStyles.orderSummaryCard}>
                <div className={reviewStyles.orderSummaryGrid}>
                  <div>
                    <h2 className={reviewStyles.orderSummaryTitle}>Order Details</h2>
                    <div className={reviewStyles.orderDetailsContent}>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>Name:</span>
                        <span className={reviewStyles.orderSummaryValue}>{name}</span>
                      </div>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>Description:</span>
                        <span className={reviewStyles.orderSummaryValue}>{description}</span>
                      </div>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>Space:</span>
                        <span className={reviewStyles.orderSummaryValue}>{space?.name || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>Status:</span>
                        <span className={reviewStyles.orderSummaryValue}>{orderDetails?.status || 'Pending'}</span>
                      </div>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>Receiving Date:</span>
                        <span className={reviewStyles.orderSummaryValue}>{orderDetails?.receivingDate || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className={reviewStyles.orderSummaryTitle}>Payment Details</h2>
                    <div className={reviewStyles.orderDetailsContent}>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>VAT:</span>
                        <span className={reviewStyles.orderSummaryValue}>{orderDetails?.vat || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>VAT Inclusive:</span>
                        <span className={reviewStyles.orderSummaryValue}>{orderDetails?.vatInclusive ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>Is Paid:</span>
                        <span className={reviewStyles.orderSummaryValue}>{orderDetails?.isPaid ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>Is Sent:</span>
                        <span className={reviewStyles.orderSummaryValue}>{orderDetails?.sent ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className={reviewStyles.orderSummaryLabel}>Total Amount:</span>
                        <span className={reviewStyles.orderSummaryValue}>Kshs {calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Items Table */}
            <div className={reviewStyles.itemsTable}>
              <h2 className="text-lg font-medium mb-4">Ordered Items</h2>
              <div className={styles.tableContainer}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ITEM NAME</TableHead>
                      <TableHead>CATEGORY</TableHead>
                      <TableHead>ITEM TYPE</TableHead>
                      <TableHead>QUANTITY</TableHead>
                      <TableHead>UNIT COST</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {/* Charges Table (if any) */}
            {charges.length > 0 && (
              <div className={reviewStyles.chargesTable}>
                <h2 className="text-lg font-medium mb-4">Additional Charges</h2>
                <div className={styles.tableContainer}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>AMOUNT</TableHead>
                        <TableHead>REASON</TableHead>
                        <TableHead>TYPE</TableHead>
                        <TableHead>INFO</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {charges.map((charge) => (
                        <TableRow key={charge.id}>
                          <TableCell>{charge.amount}</TableCell>
                          <TableCell>{charge.reason}</TableCell>
                          <TableCell>{charge.type}</TableCell>
                          <TableCell>{charge.info}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                className="flex items-center text-gray-600"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Button>
              
              <Button 
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={handleSaveOrder}
              >
                SAVE ORDER
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ChooseItems, ChooseVendor, OrderDetails, OrderCharges, OrderReview };