import React, { useEffect, useState } from 'react';
import { Package, User, Clock, CheckCircle, Truck, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { GET_CUSTOME_ORDER_HISTORY_DETAIL_MASTER, GET_CUSTOME_ORDER_HISTORY_DETAIL, Order, OrderItem } from '../services/apiConfig';
import Config from '../../config';
type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
};


const Dashboard: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[] | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const handleOrderDropdown = async (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderItems(null);
      return;
    }
    setExpandedOrderId(orderId);
    setDetailLoading(true);
    try {
      const detail = await GET_CUSTOME_ORDER_HISTORY_DETAIL(orderId);
      // If detail is an array, use as is; if object, wrap in array
      if (Array.isArray(detail)) {
        setOrderItems(detail);
      } else if (detail) {
        setOrderItems([detail]);
      } else {
        setOrderItems([]);
      }
    } catch{
      setOrderItems([]);
    } finally {
      // console.log(JON)
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = await localStorage.getItem("user");
        let userObj: User | null = null;
        if (user) {
          userObj = JSON.parse(user);
        }
        // Try both UserId and id for compatibility
        const userId = userObj ? userObj.id : null;
        // console.log(userId)
        if (!userId) {
          setOrders([]);
          setIsLoading(false);
          return;
        }
        const response = await GET_CUSTOME_ORDER_HISTORY_DETAIL_MASTER(userId);
        console.log('Orders ',Array.isArray(response) && response.length>0)
        setOrders(response);
        // Debug log for troubleshooting
        // console.log('Fetched orders for userId:', userId, response);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>My Orders</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Order History
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(orders) && orders.length > 0 && orders.map((order: Order, index) => (
                    <motion.div
                      key={order.OrderId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Order #{order.OrderId}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.OrderDateUTC).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.LatestStatusName)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.LatestStatusName)}`}>
                            {order.LatestStatusName}
                          </span>
                          <button
                            className="ml-4 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 rounded text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                            onClick={() => handleOrderDropdown(order.OrderId)}
                          >
                            {expandedOrderId === order.OrderId ? 'Hide Details' : 'View Details'}
                          </button>
                        </div>
                      </div>
                      {expandedOrderId === order.OrderId && (
                        <div className="mt-4">
                          {detailLoading ? (
                            <div className="text-center py-4 text-blue-500">Loading details...</div>
                          ) : orderItems && orderItems.length > 0 ? (
                            <div className="bg-gray-50 dark:bg-gray-900/40 rounded p-4">
                              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Order Items</h4>
                              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {orderItems.map((item) => (
                                  <li key={item.OrderItemID} className="py-2 flex items-center">
                                    <img src={`${Config.ADMIN_BASE_URL}${item.DefaultImageUrl}`} alt={item.ProductName} className="w-10 h-10 object-cover rounded mr-3" />
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 dark:text-white">{item.ProductName}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.Quantity} × ₹{item.Price.toLocaleString()}</div>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">₹{(item.Price * item.Quantity).toLocaleString()}</div>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-4 text-right">
                                <span className="font-bold text-lg text-gray-900 dark:text-white">Total: ₹{orderItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0).toLocaleString()}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-red-500">No items found.</div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Profile Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={state.user?.name || ''}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={state.user?.email || ''}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={state.user?.phone || 'Not provided'}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Profile editing functionality will be available in a future update.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;