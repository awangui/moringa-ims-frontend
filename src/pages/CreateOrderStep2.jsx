import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  
  Card,
  CardContent,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Bell, Clock, Users, ShoppingCart, FileText, Package, MessageSquare, User, Settings, Plus } from "lucide-react";

const CreateOrderStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name = "Fix Assets Order", description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." } = location.state || {};
  
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const handleBack = () => {
    navigate('/create-order');
  };
  
  const handleAddItem = () => {
    // This would open a dialog or take you to step 3 to add items
    navigate('/create-order/step3', { 
      state: { 
        name, 
        description, 
        items 
      } 
    });
  };
  
  const handleSave = () => {
    // Save the order and redirect to orders page
    navigate('/orders');
  };
  
  const formatDate = () => {
    const date = new Date();
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-8">
        <div className="text-gray-500 hover:text-blue-600">
          <Clock size={24} />
        </div>
        <div className="text-gray-500 hover:text-blue-600">
          <Users size={24} />
        </div>
        <div className="text-blue-600">
          <ShoppingCart size={24} />
        </div>
        <div className="text-gray-500 hover:text-blue-600">
          <FileText size={24} />
        </div>
        <div className="text-gray-500 hover:text-blue-600">
          <Package size={24} />
        </div>
        <div className="text-gray-500 hover:text-blue-600">
          <MessageSquare size={24} />
        </div>
        <div className="text-gray-500 hover:text-blue-600 mt-auto">
          <User size={24} />
        </div>
        <div className="text-gray-500 hover:text-blue-600">
          <Settings size={24} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="py-4 px-6 flex justify-between items-center border-b">
          <div className="text-2xl font-medium text-orange-500">
            Create Fixed Asset Order step 2
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <div className="flex mb-6">
              <Button 
                variant="ghost" 
                className="flex items-center text-gray-600"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Button>
            </div>

            {/* Order Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-xl font-semibold mb-2">{name}</h1>
                <div className="text-gray-600 max-w-lg">
                  <div className="font-medium mb-1">Description</div>
                  <p>{description}</p>
                </div>
              </div>
              <div className="text-gray-600">
                {formatDate()}
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Items</h2>
              </div>
              
              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden mb-4">
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
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No items added yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unitCost}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Add Item Button */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="bg-indigo-900 text-white hover:bg-indigo-800"
                  onClick={handleAddItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Items
                </Button>
                <div className="font-medium">
                  Cumulative Amount:
                </div>
              </div>
            </div>

            {/* Amount Details Section - Empty in this case */}
            <div className="mb-16">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>AMOUNT</TableHead>
                    <TableHead>REASON</TableHead>
                    <TableHead>TYPE</TableHead>
                    <TableHead>PAID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No payment information added yet
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Total Section */}
            <div className="flex justify-end mb-8">
              <div className="font-bold text-lg">
                TOTAL: {totalAmount > 0 ? `Kshs ${totalAmount.toLocaleString()}` : ''}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleSave}
              >
                Save Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderStep2;