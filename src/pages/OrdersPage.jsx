/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styles from './OrdersPage.module.css';
import listStyles from './OrdersList.module.css';
import viewStyles from './ViewOrder.module.css';
import sheetStyles from './StatusChangeSheet.module.css';

import Header from "../components/ui/header";
// import { Sidebar } from "../components/ui/sidebar";
import SideBar from '@/components/SideBar';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../components/ui/pagination";
import { Card, CardContent } from "../components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { DatePicker } from "../components/ui/date-picker";
import { Search, ArrowLeft, Filter, Download, MoreVertical } from 'lucide-react';
// import Navigation from "../components/Navigation";
import { getAllOrders, getOrderById, updateOrderStatus } from "../lib/api"; // Import API functions

// Constants
const STATUS_COLORS = {
  Pending: listStyles.statusPending,
  Approved: listStyles.statusApproved,
  Received: listStyles.statusReceived,
  Cancelled: listStyles.statusCancelled,
  'Partially Received': listStyles.statusPartiallyReceived,
  default: listStyles.statusDefault,
};

// Status Change Sheet Component
const StatusChangeSheet = ({ order, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className={sheetStyles.sheetContent}>
        <SheetHeader>
          <SheetTitle>Change Status</SheetTitle>
          <SheetDescription>
            Update the status of this order
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-4">
          <Select onValueChange={(value) => {
            onStatusChange(order.id, value);
            setIsOpen(false);
          }}>
            <SelectTrigger className={sheetStyles.selectTrigger}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent  className={sheetStyles.selectContent}>
              <SelectItem value="Approved" className={sheetStyles.selectItem}>Approved</SelectItem>
              <SelectItem value="Cancelled" className={sheetStyles.selectItem}>Cancelled</SelectItem>
              <SelectItem value="Received" className={sheetStyles.selectItem}>Received</SelectItem>
              <SelectItem value="Partially Received" className={sheetStyles.selectItem}>Partially Received</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const OrdersList = () => {
  //state variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCreateOrder = () => {
    navigate('/create-order/step1');
  };

  const handleViewOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      navigate(`/orders/${orderId}`, { state: order }); //Pases the order object as state to the next page so the order details are available there
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    //Checks if the status is partially received
    if (newStatus === 'Partially Received') {
      //finds the order in the orders by ID
      const order = orders.find((o) => o.id === orderId);
      //stores it 
      setSelectedOrderForPartialReceive(order);
      //opens a dialog (sheet) to handle partially receiving
      setIsPartiallyReceivedDialogOpen(true);
    } else {
      //if status is anything else
      try {
        //call the api
        const updatedOrder = await updateOrderStatus(orderId, newStatus);
        //map over orders
        const updatedOrders = orders.map((order) =>
          //update the state of the specific order
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        );
        setOrders(updatedOrders);
      } catch (err) {
        console.error('Failed to update order status:', err);
        setError('Failed to update order status. Please try again.');
      }
    }
  };

  const handlePartiallyReceivedConfirm = async () => {
    try {
      const formattedDate = new Date().toISOString().split('T')[0]; // Ensures yyyy-mm-dd format
  
      const updatedOrder = await updateOrderStatus(
        selectedOrderForPartialReceive.id,
        'Partially Received',
        formattedDate
      );
  
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrderForPartialReceive.id) {
          return {
            ...order,
            status: updatedOrder.status,
            items: order.items.map((item) => ({
              ...item,
              receivedQuantity: partiallyReceivedQuantities[item.id] || 0,
            })),
            date_received: formattedDate, // Ensure it's correctly stored in state
          };
        }
        return order;
      });
  
      setOrders(updatedOrders);
      
      // Close the dialog and reset the received quantities
      setIsPartiallyReceivedDialogOpen(false);
      setPartiallyReceivedQuantities({});
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status. Please try again.');
    }
  };
  

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setPaymentStatus('all');
    setOrderStatus('all');
  };

  const applyFilters = (orderList) => {
    return orderList.filter((order) => {
      //convert the order.date to a date object >
      const orderDate = new Date(order.date);
      const dateInRange = (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate);
      //"paid" &/or "unpaid" Only include orders where orderDetails?.isPaid is true/false for unpaid.>
      const isPaidFilter = paymentStatus === 'all' ||
        (paymentStatus === 'paid' && order.orderDetails?.isPaid) ||
        (paymentStatus === 'unpaid' && !order.orderDetails?.isPaid);
      const statusFilter = orderStatus === 'all' ||
        (orderStatus === 'sent' && order.status === 'Approved') ||
        (orderStatus === 'not-sent' && order.status !== 'Approved');
      return dateInRange && isPaidFilter && statusFilter;
    });
  };

  const handleApplyFilters = () => {
    setIsFilterSheetOpen(false); // Close the filter sheet
    // The filtered orders will be computed automatically
  };

  const filteredOrders = applyFilters(
    (orders || []).filter((order) =>
      (order?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (String(order?.id || '').toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );  

  const handlePageChange = (page, pageSize = itemsPerPage) => {
    setCurrentPage(page);
    if (pageSize !== itemsPerPage) {
      setItemsPerPage(pageSize);
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // <Navigation>
    <div className="wrapper" style={{ display: "flex", gap: "100px"}}>
      <SideBar/>
      <div className={styles.container}>
        {/* <Sidebar /> */}
        <div className={styles.content}>
          <div className={styles.mainContent}>
            <div className={styles.maxWidth}>
              <div className={styles.header}>
                <h1 className={styles.title}>Purchase Orders</h1>
                <Button
                  className="bg-orange-500 text-white hover:bg-orange-600"
                  onClick={handleCreateOrder}
                >
                  CREATE ORDER
                </Button>
              </div>

              <div className={styles.header}>
                <div className={styles.searchContainer}>
                  {/* <Search className={styles.searchIcon} /> */}
                  <Input
                    type="text"
                    placeholder="Search orders"
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className={styles.filterButton}>
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </SheetTrigger>
                    <SheetContent className={sheetStyles.sheetContent}>
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
                            <SelectContent className={sheetStyles.selectContent}>
                              <SelectItem value="all" className={sheetStyles.selectItem}>All</SelectItem>
                              <SelectItem value="paid" className={sheetStyles.selectItem}>Paid</SelectItem>
                              <SelectItem value="unpaid" className={sheetStyles.selectItem}>Unpaid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Order Status</h3>
                          <Select value={orderStatus} onValueChange={setOrderStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className={sheetStyles.selectContent}>
                              <SelectItem value="all" className={sheetStyles.selectItem}>All</SelectItem>
                              <SelectItem value="sent" className={sheetStyles.selectItem}>Sent</SelectItem>
                              <SelectItem value="not-sent" className={sheetStyles.selectItem}>Not Sent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={resetFilters}>Reset</Button>
                          <SheetClose asChild>
                            <Button onClick={handleApplyFilters}>Apply Filters</Button>
                          </SheetClose>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Button variant="outline" className={styles.exportButton}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className={styles.tableContainer}>
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
                            <span className={`${listStyles.statusBadge} ${STATUS_COLORS[order.status] || STATUS_COLORS.default}`}>
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
                              <StatusChangeSheet order={order} onStatusChange={handleStatusChange} />
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
                <div className={styles.pagination}>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={index + 1}>
                          <PaginationLink
                            isActive={currentPage === index + 1}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              <Sheet open={isPartiallyReceivedDialogOpen} onOpenChange={setIsPartiallyReceivedDialogOpen}>
                <SheetContent className={sheetStyles.sheetContent}>
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
                    <SheetClose asChild>
                      <Button onClick={handlePartiallyReceivedConfirm}>Continue</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      </div>
    // </Navigation>
  );
};

// View Single Order
const ViewOrder = () => {
  const location = useLocation();
  //get the order ID from the URL
  const { id } = useParams();
  console.log("Order ID from useParams:", id);
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);

  useEffect(() => {
    //If order is already available (e.g., from location.state), no need to fetch data again.
    if (!order) {
      const fetchOrder = async () => {
        try {
          //Retrieves orders from localStorage and tries to find an order with the matching id.
          const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          const foundOrder = storedOrders.find((o) => o.id === id);
          //If found, it sets order using setOrder(foundOrder).
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            //If not found in localStorage, it calls getOrderById(id) to fetch the order.
            const data = await getOrderById(id);
            setOrder(data);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className={styles.container}>
        {/* <Sidebar /> */}
        <div className={styles.content}>
          <Header title="Loading Order..." />
          <div className={styles.mainContent}>
            <div className="text-center text-gray-500">Fetching order details...</div>
          </div>
        </div>
      </div>
    );
  }
 //if an error occured or order is null >>
  if (error || !order) {
    return (
      <div className={styles.container}>
        {/* <Sidebar /> */}
        <div className={styles.content}>
          <Header title="Order Not Found" />
          <div className={styles.mainContent}>
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
  //If order is available, displayOrder is assigned the order object.>>
  // if null, defaults to empty object
  const displayOrder = order || {};

  return (
    // <Navigation>
    <div className="wrapper" style={{ display: "flex", gap: "100px"}}>
      <SideBar/>
      <div className={styles.container}>
        {/* <Sidebar /> */}
        <div className={styles.content}>
          <Header title={`Order ${displayOrder.id}`} />
          <div className={styles.mainContent}>
            <div className={styles.maxWidth}>
                        <h1 className={styles.title}>Purchase Order Details</h1>

                        <Card className={viewStyles.card}>
                          <CardContent className={viewStyles.cardContent}>
                            <div className={viewStyles.orderDetails}>
                              <div>
                                <h2 className={viewStyles.orderDetailsTitle}>Order Details</h2>
                                <div className={viewStyles.orderDetailsContent}>
                                  <div>
                                    <span className={viewStyles.orderDetailsLabel}>Purchase Order:</span>
                                    <span className={viewStyles.orderDetailsValue}>{displayOrder.id}</span>
                                  </div>
                                  <div>
                                    <span className={viewStyles.orderDetailsLabel}>Name:</span>
                                    <span className={viewStyles.orderDetailsValue}>{displayOrder.name}</span>
                                  </div>
                                  <div>
                                    <span className={viewStyles.orderDetailsLabel}>Description:</span>
                                    <span className={viewStyles.orderDetailsValue}>{displayOrder.description}</span>
                                  </div>
                                  <div>
                                    <span className={viewStyles.orderDetailsLabel}>Status:</span>
                                    <span className={`${listStyles.statusBadge} ${STATUS_COLORS[displayOrder.status] || STATUS_COLORS.default}`}>
                                      {displayOrder.status || 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
                  {/* </Navigation> */}
                  </div>
              );
            };
            
            export { OrdersList, ViewOrder };