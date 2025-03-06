import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FaThLarge, FaUser, FaClipboardList, FaBox, FaEnvelope, FaUsers,
  FaCog, FaBars, FaSignOutAlt, FaBuilding, FaUndoAlt, FaUserFriends, FaSpinner
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
    { name: 'Orders', icon: FaClipboardList, path: '/orders' },
    { name: 'Items', icon: FaBox, path: '/items' },
    { name: 'Requests', icon: FaEnvelope, path: '/requests' },
    { name: 'Users', icon: FaUsers, path: '/users' },
    { name: 'Returns', icon: FaUndoAlt, path: '/returns' },
    { name: 'Spaces', icon: FaBuilding, path: '/spaces' },
    { name: 'Teams', icon: FaUserFriends, path: '/teams' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'w-20' : 'w-64'} bg-[#FDF6F0] p-4 transition-all duration-300`}>
        <div className="logo text-center mb-6">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-[#0D2240] text-white rounded-md hover:bg-[#FF6B35] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B35]"
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        <ul className="menu space-y-2">
          {menuItems.map((item) => (
            <Link to={item.path} key={item.name} className="no-underline">
              <li
                className={`menu-item flex items-center p-3 rounded-md transition-colors duration-200 gap-4 ${
                  location.pathname === item.path
                    ? 'bg-[#0D2240] text-white'
                    : 'text-[#0D2240] hover:bg-[#FF6B35] hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon className="text-lg" />
                {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </li>
            </Link>
          ))}
        </ul>

        {/* Profile */}
        <div className={`profile mt-8 flex items-center p-3 rounded-lg bg-gray-50 shadow-sm text-[#0D2240] gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="p-2 bg-[#0D2240] rounded-full">
            <FaUser className="text-xl text-white" />
          </div>
          {!isCollapsed && (
            <div>
              {profile.name === 'Loading...' ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin text-xs text-gray-500" />
                  <span className="text-xs font-medium text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-bold">{profile.name}</h3>
                  <p className="text-xs text-gray-600">{profile.email}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Settings & Logout */}
        <div className={`settings mt-4 flex items-center cursor-pointer gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <FaCog className="text-lg text-[#0D2240] hover:text-[#FF6B35] transition-colors duration-200" />
          {!isCollapsed && <span className="text-sm font-medium text-[#0D2240] hover:text-[#FF6B35] transition-colors duration-200">Settings</span>}
        </div>

        <div className={`logout mt-4 flex items-center cursor-pointer gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <FaSignOutAlt className="text-lg text-red-500 hover:text-[#FF6B35] transition-colors duration-200" />
          {!isCollapsed && <span className="text-sm font-medium text-red-500 hover:text-[#FF6B35] transition-colors duration-200">Logout</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto flex justify-between">{children}</div>
    </div>
  );
}

export default Navigation;
