/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Bell, Clock, Users, ShoppingCart, FileText, Package, MessageSquare, User, Settings } from "lucide-react";
import styles from './CreateOrderPage.module.css';

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Fix Assets Order');
  const [description, setDescription] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to step 2 with the form data
    navigate('/create-order/step2', { 
      state: { 
        name, 
        description 
      } 
    });
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
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
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            Create Fixed Asset Order step 1
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
                onClick={handleCancel}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className="space-y-2">
                    <label htmlFor="name" className={styles.formLabel}>Order Name</label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter order name"
                      required
                      className={styles.formInput}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className={styles.formLabel}>Description</label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter order description"
                      rows={4}
                      className={styles.formTextarea}
                    />
                  </div>
                  <div className={styles.formButtons}>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                      Next
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;