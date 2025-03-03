import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FaThLarge,
  FaUser,
  FaClipboardList,
  FaBox,
  FaEnvelope,
  FaUsers,
  FaCog,
  FaBars,
  FaSignOutAlt,
  FaBuilding,
} from 'react-icons/fa';

function Navigation({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState({ name: 'Loading...', email: '' });
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://api.com/profile');
        const data = await response.json();
        setProfile({ name: data.name, email: data.email });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: FaThLarge, path: '/' },
    { name: 'Vendors', icon: FaUser, path: '/vendors' },
    // { name: 'Inventory', icon: FaTruck, path: '/inventory' },
    { name: 'Orders', icon: FaClipboardList, path: '/orders' },
    { name: 'Items', icon: FaBox, path: '/items' },
    { name: 'Requests', icon: FaEnvelope, path: '/requests' },
    { name: 'Users', icon: FaUsers, path: '/users' },
    { name: 'Spaces', icon: FaBuilding, path: '/spaces' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'w-20' : 'w-64'} bg-gray-100 p-4 transition-all duration-300`}>
        <div className="logo text-center mb-4">
          <button onClick={toggleSidebar} className="text-xl">
            <FaBars />
          </button>
        </div>

        <ul className="menu space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`menu-item flex items-center p-2 rounded-lg ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              } ${location.pathname === item.path ? 'bg-indigo-900 text-white' : 'hover:bg-gray-200'}`}
            >
              <item.icon className="text-lg" />
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
            </li>
          ))}
        </ul>

        <div className={`profile mt-8 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <FaUser className="text-xl" />
          {!isCollapsed && (
            <div>
              <h3 className="text-sm font-bold">{profile.name}</h3>
              <p className="text-xs text-gray-500">{profile.location}</p>
            </div>
          )}
        </div>

        <div className={`settings mt-4 flex items-center text-gray-500 hover:text-indigo-900 cursor-pointer ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <FaCog className="text-lg" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </div>

        <div className={`logout mt-4 flex items-center text-gray-500 hover:text-red-500 cursor-pointer ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <FaSignOutAlt className="text-lg" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default Navigation;
