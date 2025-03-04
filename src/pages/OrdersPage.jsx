/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Sidebar } from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, ArrowLeft, Filter, Download, MoreVertical } from 'lucide-react';

// Constants
const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Received: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-800',
  'Partially Received': 'bg-purple-100 text-purple-800',
  default: 'bg-gray-100 text-gray-800',
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [orderStatus, setOrderStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [partiallyReceivedQuantities, setPartiallyReceivedQuantities] = useState({});
  const [isPartiallyReceivedDialogOpen, setIsPartiallyReceivedDialogOpen] = useState(false);
  const [selectedOrderForPartialReceive, setSelectedOrderForPartialReceive] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(storedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  }, []);

  const handleCreateOrder = () => {
    navigate('/create-order/step1');
  };

  const handleViewOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      navigate(`/orders/${orderId}`, { state: order });
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === 'Partially Received') {
      const order = orders.find((o) => o.id === orderId);
      setSelectedOrderForPartialReceive(order);
      setIsPartiallyReceivedDialogOpen(true);
    } else {
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  const handlePartiallyReceivedConfirm = () => {
    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrderForPartialReceive.id) {
        return {
          ...order,
          status: 'Partially Received',
          items: order.items.map((item) => ({
            ...item,
            receivedQuantity: partiallyReceivedQuantities[item.id] || 0,
          })),
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setIsPartiallyReceivedDialogOpen(false);
    setPartiallyReceivedQuantities({}); // Reset quantities
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setPaymentStatus('all');
    setOrderStatus('all');
  };

  const applyFilters = (orderList) => {
    return orderList.filter((order) => {
      const orderDate = new Date(order.date);
      const dateInRange = (!startDate || orderDate >= startDate) && 
                          (!endDate || orderDate <= endDate);
      
      const isPaidFilter = paymentStatus === 'all' || 
                          (paymentStatus === 'paid' && order.orderDetails?.isPaid) ||
                          (paymentStatus === 'unpaid' && !order.orderDetails?.isPaid);
      
      const statusFilter = orderStatus === 'all' || 
                          (orderStatus === 'sent' && order.status === 'Approved') ||
                          (orderStatus === 'not-sent' && order.status !== 'Approved');
      
      return dateInRange && isPaidFilter && statusFilter;
    });
  };

  const filteredOrders = applyFilters(
    (orders || []).filter((order) =>
      (order?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order?.id?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );
  

  const handlePageChange = (page, pageSize = itemsPerPage) => {
    setCurrentPage(page);
    if (pageSize !== itemsPerPage) {
      setItemsPerPage(pageSize);
    }
  };

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-medium text-orange-500">Purchase Orders</h1>
              <Button
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={handleCreateOrder}
              >
                CREATE ORDER
              </Button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search orders"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Orders</SheetTitle>
                      <SheetDescription>
                        Customize your order view with filters
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Date Range</h3>
                        <div className="flex flex-col space-y-2">
                          <DatePicker
                            placeholderText="Start Date"
                            className="w-full"
                            selected={startDate}
                            onChange={setStartDate}
                          />
                          <DatePicker
                            placeholderText="End Date"
                            className="w-full"
                            selected={endDate}
                            onChange={setEndDate}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Payment Status</h3>
                        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Order Status</h3>
                        <Select value={orderStatus} onValueChange={setOrderStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="not-sent">Not Sent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={resetFilters}>Reset</Button>
                        <Button>Apply Filters</Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <Button variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PURCHASE ORDER</TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.name}</TableCell>
                        <TableCell>
                          {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[order.status] || STATUS_COLORS.default}`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order.id)}
                            >
                              View
                            </Button>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Change Status</SheetTitle>
                                  <SheetDescription>
                                    Update the status of this order
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="py-6 space-y-4">
                                  <Select onValueChange={(value) => handleStatusChange(order.id, value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Approved">Approved</SelectItem>
                                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                                      <SelectItem value="Received">Received</SelectItem>
                                      <SelectItem value="Partially Received">Partially Received</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </SheetContent>
                            </Sheet>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        {orders.length === 0 ? 'No orders created yet' : 'No matching orders found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredOrders.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}

            {/* Partially Received Dialog */}
            <Sheet open={isPartiallyReceivedDialogOpen} onOpenChange={setIsPartiallyReceivedDialogOpen}>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Partially Received</SheetTitle>
                  <SheetDescription>
                    Enter the quantities received for each item.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-4">
                  {selectedOrderForPartialReceive?.items?.map((item, index) => (
                    <div key={item.id || index} className="space-y-2">
                      <label className="text-sm font-medium">{item.name}</label>
                      <Input
                        type="number"
                        placeholder="Quantity Received"
                        value={partiallyReceivedQuantities[item.id] || ''}
                        onChange={(e) =>
                          setPartiallyReceivedQuantities((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                  <Button onClick={handlePartiallyReceivedConfirm}>Continue</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};





// View Single Order
const ViewOrder = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const order = location.state;

  if (!order) {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = storedOrders.find((o) => o.id === id);
      if (!foundOrder) {
        return (
          <div className="flex h-screen bg-white">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header title="View Order" />
              <div className="flex-1 p-6 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-medium text-gray-800 mb-4">Order Not Found</h1>
                  <Button
                    className="bg-orange-500 text-white hover:bg-orange-600"
                    onClick={() => navigate('/orders')}
                  >
                    Back to Orders
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error('Failed to load order:', error);
    }
  }

  const displayOrder = order || {};

  const calculateTotal = () => {
    const itemsTotal = (displayOrder.items || []).reduce((sum, item) => {
      const costString = item.unitCost?.replace('Kshs ', '').replace(',', '') || '0';
      const cost = parseFloat(costString) || 0;
      return sum + cost * (item.quantity || 0);
    }, 0);

    const chargesTotal = (displayOrder.charges || []).reduce((sum, charge) => {
      return sum + (parseFloat(charge.amount) || 0);
    }, 0);

    return (itemsTotal + chargesTotal).toLocaleString();
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={`Order ${displayOrder.id}`} />
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                className="mr-4"
                onClick={() => navigate('/orders')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-medium text-orange-500">Purchase Order Details</h1>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Order Details</h2>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-500">Purchase Order:</span>
                        <span className="ml-2 font-medium">{displayOrder.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="ml-2">{displayOrder.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Description:</span>
                        <span className="ml-2">{displayOrder.description}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Space:</span>
                        <span className="ml-2">{displayOrder.space?.name || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date Created:</span>
                        <span className="ml-2">
                          {displayOrder.date ? new Date(displayOrder.date).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${STATUS_COLORS[displayOrder.status] || STATUS_COLORS.default}`}>
                          {displayOrder.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium mb-4">Payment Details</h2>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-500">VAT:</span>
                        <span className="ml-2">{displayOrder.orderDetails?.vat || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">VAT Inclusive:</span>
                        <span className="ml-2">{displayOrder.orderDetails?.vatInclusive ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Is Paid:</span>
                        <span className="ml-2">{displayOrder.orderDetails?.isPaid ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Receiving Date:</span>
                        <span className="ml-2">{displayOrder.orderDetails?.receivingDate || 'Not specified'}</span>
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

            {(displayOrder.items || []).length > 0 && (
              <div className="mb-8">
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
                      {(displayOrder.items || []).map((item, index) => (
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
            )}

            {(displayOrder.charges || []).length > 0 && (
              <div className="mb-8">
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
                      {(displayOrder.charges || []).map((charge, index) => (
                        <TableRow key={charge.id || index}>
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

            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => navigate('/orders')}
              >
                Back to Orders
              </Button>
              {/* <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Download PDF
              </Button>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                Mark as Approved
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { OrdersList, ViewOrder };