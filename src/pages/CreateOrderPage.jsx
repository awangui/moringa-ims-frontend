import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell, Clock, Users, ShoppingCart, FileText, Package, MessageSquare, User, Settings } from "lucide-react";

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
            Create Fixed Asset Order step 1
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto mt-10">
            {/* Back Button */}
            <div className="mb-6">
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Order Name</label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter order name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter order description"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
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