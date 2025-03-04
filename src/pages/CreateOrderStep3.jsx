/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useNavigate, useLocation, Routes, Route, useParams } from 'react-router-dom';
import {
  Button,
} from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
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



// Common header for all steps
const Header = ({ title }) => {
  return (
    <div className="py-4 px-6 flex justify-between items-center border-b">
      <div className="text-2xl font-medium text-orange-500">
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
    // { id: "choose-space", label: "CHOOSE SPACE", icon: <FileText size={16} /> },
    { id: "add-order-details", label: "ADD ORDER DETAILS", icon: <Package size={16} /> },
    { id: "add-order-charges", label: "ADD ORDER CHARGES", icon: <MessageSquare size={16} /> },
    { id: "view-order", label: "VIEW ORDER", icon: <User size={16} /> }
  ];

  const handleCancel = () => {
    navigate('/orders');
}

  return (
    <div className="flex w-full bg-gray-100">
      {steps.map((step, index) => (
        <div 
          key={step.id} 
          className={`flex items-center justify-center py-2 px-4 ${
            index === currentStep ? "bg-indigo-900 text-white" : "bg-gray-200 text-gray-600"
          } ${index < currentStep ? "opacity-50" : ""}`}
          style={{ flex: 1 }}
        >
          <div className="flex items-center gap-2">
            {step.icon}
            <span className="text-xs font-medium">{step.label}</span>
          </div>
        </div>
      ))}
      <button onClick={handleCancel}> <div className="flex items-center justify-center py-2 px-4 bg-gray-200">
        <X size={16} />
        <span  className="ml-1 text-xs font-medium">CANCEL</span>
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
    <div className="flex justify-between items-center mt-4">
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
    { id: 1, name: "Bandages", category: "Medical",  quantity: 500, unitCost: "Kshs 50,345" },
    { id: 2, name: "Bandages", category: "Medical",  quantity: 500, unitCost: "Kshs 50,345" },
    { id: 3, name: "Bandages", category: "Medical",  quantity: 500, unitCost: "Kshs 50,345" },
    { id: 4, name: "Bandages", category: "Medical",  quantity: 500, unitCost: "Kshs 50,345" },
    { id: 5, name: "Bandages", category: "Medical",  quantity: 500, unitCost: "Kshs 50,345" },
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
    <div className="flex h-screen bg-white">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Creating Order Step 3" />

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Title */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-medium text-orange-500">Choose Items</h1>
              <div className="text-right">
                <Bell size={24} />
              </div>
            </div>

            {/* Stepper */}
            <OrderStepper currentStep={0} />

            {/* Search Bar */}
            <div className="my-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>ITEM NAME</TableHead>
                    <TableHead>CATEGORY</TableHead>
                    {/* <TableHead>ITEM TYPE</TableHead> */}
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
                      {/* <TableCell>{item.type}</TableCell> */}
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

//Adding a Vendor
const ChooseVendor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, description, items = [] } = location.state || {};
  
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  const availableVendors = [
    { id: 1, name: "Vendor A" },
    { id: 2, name: "Vendor B" },
    { id: 3, name: "Vendor C" },
  ];
  
  const handleBack = () => {
    navigate('/create-order/step3/items', {
      state: { name, description, items }
    });
  };
  
  const handleContinue = () => {
    navigate('/create-order/step3/details', {
      state: { name, description, items, vendor: selectedVendor }
    });
  };
  
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Choose Vendor" />
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-medium text-orange-500">Choose a Vendor</h1>
            <div className="border rounded-lg overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableVendors.map((vendor) => (
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

// // Step 4: Choose Space
// const ChooseSpace = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { name, description, items = [] } = location.state || {};
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSpace, setSelectedSpace] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
  
//   // Sample spaces for selection
//   const availableSpaces = [
//     { id: 1, name: "Room...103" },
//     { id: 2, name: "Room...102" },
//     { id: 3, name: "Room...101" },
//     { id: 4, name: "Room..." },
//   ];
  
//   const handleBack = () => {
//     navigate('/create-order/step3/items', { 
//       state: { 
//         name, 
//         description, 
//         items 
//       } 
//     });
//   };
  
//   const handleContinue = () => {
//     navigate('/create-order/step3/details', { 
//       state: { 
//         name, 
//         description, 
//         items,
//         space: selectedSpace
//       } 
//     });
//   };
  
//   const handleSpaceSelection = (space) => {
//     setSelectedSpace(space);
//   };

//   const handlePageChange = (page, pageSize = itemsPerPage) => {
//     setCurrentPage(page);
//     if (pageSize !== itemsPerPage) {
//       setItemsPerPage(pageSize);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-white">
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <Header title="Create Order Step 4" />

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           <div className="max-w-5xl mx-auto">
//             {/* Title */}
//             <div className="flex justify-between items-center mb-4">
//               <h1 className="text-2xl font-medium text-orange-500">Choose Space</h1>
//               <div className="text-right">
//                 <Bell size={24} />
//               </div>
//             </div>

//             {/* Stepper */}
//             <OrderStepper currentStep={1} />

//             {/* Search Bar */}
//             <div className="my-6">
//               <div className="relative">
//                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                 <Input
//                   type="text"
//                   placeholder="Search"
//                   className="pl-10"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Spaces Table */}
//             <div className="border rounded-lg overflow-hidden mb-4">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-8/12">NAME</TableHead>
//                     <TableHead className="w-4/12"></TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {availableSpaces.map((space) => (
//                     <TableRow key={space.id}>
//                       <TableCell>{space.name}</TableCell>
//                       <TableCell>
//                         <Checkbox 
//                           checked={selectedSpace?.id === space.id}
//                           onCheckedChange={() => handleSpaceSelection(space)}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination */}
//             <Pagination 
//               currentPage={currentPage}
//               totalItems={57}
//               itemsPerPage={itemsPerPage}
//               onPageChange={handlePageChange}
//             />

//             {/* Navigation Buttons */}
//             <div className="flex justify-between mt-8">
//               <Button 
//                 variant="outline" 
//                 className="flex items-center text-gray-600"
//                 onClick={handleBack}
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 BACK
//               </Button>
              
//               <Button 
//                 className="bg-indigo-900 text-white hover:bg-indigo-800"
//                 onClick={handleContinue}
//               >
//                 Continue <ChevronRight className="ml-1 h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Step 5: Enter Purchase Order Details
const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, description, items = [], space } = location.state || {};
  
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
        orderDetails
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
    <div className="flex h-screen bg-white">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Create Order Step 5" />

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Title */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-medium text-orange-500">Enter Purchase Order Details</h1>
            </div>

            {/* Stepper */}
            <OrderStepper currentStep={2} />

            {/* Order Details Form */}
            <div className="py-8 max-w-md mx-auto">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="vat">VAT</Label>
                  <Input 
                    id="vat" 
                    placeholder="Enter VAT" 
                    value={orderDetails.vat}
                    onChange={(e) => handleChange('vat', e.target.value)}
                    className="mt-1"
                  />
                  <div className="mt-2 flex items-center">
                    <Checkbox 
                      id="vatInclusive" 
                      checked={orderDetails.vatInclusive}
                      onCheckedChange={(checked) => handleChange('vatInclusive', checked)}
                    />
                    <label htmlFor="vatInclusive" className="ml-2 text-sm">VAT inclusive</label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input 
                    id="status" 
                    value={orderDetails.status}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="receivingDate">Receiving Date</Label>
                  <div className="relative">
                    <Input 
                      id="receivingDate" 
                      value={orderDetails.receivingDate}
                      onChange={(e) => handleChange('receivingDate', e.target.value)}
                      className="mt-1"
                    />
                    <ChevronRight className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Checkbox 
                      id="isPaid" 
                      checked={orderDetails.isPaid}
                      onCheckedChange={(checked) => handleChange('isPaid', checked)}
                    />
                    <label htmlFor="isPaid" className="ml-2 text-sm">is_paid</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox 
                      id="sent" 
                      checked={orderDetails.sent}
                      onCheckedChange={(checked) => handleChange('sent', checked)}
                    />
                    <label htmlFor="sent" className="ml-2 text-sm">sent</label>
                  </div>
                </div>
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
  const { name, description, items = [], space, orderDetails } = location.state || {};
  
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
        charges
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
    <div className="flex h-screen bg-white">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Create Purchase Order" />

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Title */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-medium text-orange-500">Create Purchase Order</h1>
            </div>

            {/* Stepper */}
            <OrderStepper currentStep={3} />

            {/* Charges Form */}
            <div className="py-8 max-w-md mx-auto">
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
              <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Added Charges</h2>
                <div className="border rounded-lg overflow-hidden">
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
    const { name, description, items = [], space, orderDetails, charges = [] } = location.state || {};
    
    const handleBack = () => {
      navigate('/create-order/step3/review', { 
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
    
    const handleSaveOrder = () => {
      // Here we would typically save the order to a database
      // For now, we'll just navigate back to the orders list
      const newOrder = {
        id: `PO-${Math.floor(Math.random() * 100000)}`,
        name,
        description,
        items,
        space,
        orderDetails,
        charges,
        date: new Date().toISOString(),
        status: orderDetails.status
      };
      
      // We could store this in localStorage for demo purposes
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
      
      // Navigate to orders list
      navigate('/orders');
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
      <div className="flex h-screen bg-white">
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header title="View Order" />
          {/* Main Content Area */}
          <div className="flex-1 p-6">
            <div className="max-w-5xl mx-auto">
              {/* Title */}
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-medium text-orange-500">View Order</h1>
              </div>
              {/* Stepper */}
              <OrderStepper currentStep={4} />
              
              {/* Order Summary Card */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-lg font-medium mb-4">Order Details</h2>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <span className="ml-2 font-medium">{name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Description:</span>
                          <span className="ml-2">{description}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Space:</span>
                          <span className="ml-2">{space?.name || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className="ml-2">{orderDetails?.status || 'Pending'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Receiving Date:</span>
                          <span className="ml-2">{orderDetails?.receivingDate || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium mb-4">Payment Details</h2>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-500">VAT:</span>
                          <span className="ml-2">{orderDetails?.vat || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">VAT Inclusive:</span>
                          <span className="ml-2">{orderDetails?.vatInclusive ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Is Paid:</span>
                          <span className="ml-2">{orderDetails?.isPaid ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Is Sent:</span>
                          <span className="ml-2">{orderDetails?.sent ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Amount:</span>
                          <span className="ml-2 font-medium text-orange-500">Kshs {calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Items Table */}
              <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Ordered Items</h2>
                <div className="border rounded-lg overflow-hidden">
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
                <div className="mt-8">
                  <h2 className="text-lg font-medium mb-4">Additional Charges</h2>
                  <div className="border rounded-lg overflow-hidden">
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

  export { ChooseItems,ChooseVendor,  OrderDetails, OrderCharges, OrderReview };