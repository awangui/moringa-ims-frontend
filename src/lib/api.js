// src/lib/api.js
import axios from 'axios';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: 'http://172.236.2.18:5376', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
     //'API-Key': 'OMpqVWAH.UC80wyXTtPwhDgAUdCTx6', // Add the API key to headers
  },
});

// Add an interceptor to dynamically set the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Retrieve token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



  
  // Function to fetch all vendors
export const getVendors = async () => {
    try {
      const response = await axios.get('http://172.236.2.18:5555/vendors/'); // Fetch vendors from the vendor API
      return response.data; // Assuming the response contains the list of vendors
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      throw error;
    }
  };
  
// Function to create a new order
export const createOrder = async (orderData) => {
    try {
      console.log('Sending order data:', orderData); // Debug log
      const response = await api.post('/orders/', orderData); // Updated endpoint
      console.log('Order creation response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up the request:', error.message);
      }
      throw error;
    }
  };

// Function to fetch all orders
export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders/');
    return response.data; // Assuming the response contains the list of orders
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

// Function to fetch an order by ID
export const getOrderById = async (orderId) => {
    if (!orderId) {
      console.error('Error: orderId is undefined or null');
      return null; // or throw an error
    }
    try {
      console.log("Fetching order with ID:", orderId);
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order by ID:', error);
      throw error;
    }
  };
  

// Function to update order status
export const updateOrderStatus = async (orderId, receivedQuantity, dateReceived) => {
  try {
    const response = await api.post('/received', { 
      order_id: orderId, 
      received_quantity: receivedQuantity, 
      date_received: dateReceived 
    });

    return response.data; // Assuming the response contains the updated order
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
};

export default api;