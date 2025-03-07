/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { ArrowLeft, Bell, Clock, Users, ShoppingCart, FileText, Package, MessageSquare, User, Settings, Plus } from "lucide-react";
import { createOrder } from '../lib/api'; // Adjust the path as needed
import styles from './CreateOrderStep2.module.css';
import SideBar from '@/components/SideBar';

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
    // Navigate to step 3 to add items
    navigate('/create-order/step3', { 
      state: { 
        name, 
        description, 
        items 
      } 
    });
  };
  
  const handleSave = async () => {
    const orderData = {
      order_name: name,
      order_description: description,
      items,
      space: "room 102", // Replace with actual space if available
      vat: 19.99, // Replace with actual VAT if available
      quantity: items.reduce((sum, item) => sum + item.quantity, 0), // Calculate total quantity
      status: "Pending",
      date_ordered: new Date().toISOString().split('T')[0], // Today's date
      payment_status: "Paid",
      dispatch_status: "Processing",
      delivery_charges: 1500, // Replace with actual delivery charges if available
      reason: "driver lunch", // Replace with actual reason if available
      initialiser: "Admin", // Replace with actual initialiser if available
    };
  
    try {
      const response = await createOrder(orderData);
      console.log('Order created:', response);
      navigate('/orders'); // Redirect to the orders list page
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };
  
  const formatDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensures two digits
    const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits
    return `${year}-${month}-${day}`;
  };  

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <SideBar/>
      {/* <div className={styles.sidebar}>
        <div className={styles.sidebarIcon}>
          <Clock size={24} />
        </div>
        <div className={styles.sidebarIcon}>
          <Users size={24} />
        </div>
        <div className={styles.sidebarIconActive}>
          <ShoppingCart size={24} />
        </div>
        <div className={styles.sidebarIcon}>
          <FileText size={24} />
        </div>
        <div className={styles.sidebarIcon}>
          <Package size={24} />
        </div>
        <div className={styles.sidebarIcon}>
          <MessageSquare size={24} />
        </div>
        <div className={`${styles.sidebarIcon} mt-auto`}>
          <User size={24} />
        </div>
        <div className={styles.sidebarIcon}>
          <Settings size={24} />
        </div>
      </div> */}

      {/* Main Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            Create Fixed Asset Order step 2
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.maxWidth}>
            {/* Back Button */}
            <div className={styles.backButton}>
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
            <div className={styles.orderHeader}>
              <div>
                <h1 className={styles.orderTitle}>{name}</h1>
                <div className={styles.orderDescription}>
                  <div className="font-medium mb-1">Description</div>
                  <p>{description}</p>
                </div>
              </div>
              <div className={styles.orderDate}>
                {formatDate()}
              </div>
            </div>

            {/* Items Section */}
            <div className={styles.itemsSection}>
              <div className={styles.itemsHeader}>
                <h2 className="text-lg font-medium">Items</h2>
              </div>
              
              {/* Items Table */}
              <div className={styles.itemsTable}>
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
              <div className={styles.addItemButton}>
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
            <div className={styles.amountSection}>
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
            <div className={styles.totalSection}>
              <div className={styles.totalText}>
                TOTAL: {totalAmount > 0 ? `Kshs ${totalAmount.toLocaleString()}` : ''}
              </div>
            </div>

            {/* Save Button */}
            <div className={styles.saveButton}>
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