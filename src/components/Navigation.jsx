import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
  FaUndoAlt,
  FaUserFriends,
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
    { name: 'Dashboard', icon: FaThLarge, path: '/dashboard' },
    { name: 'Vendors', icon: FaUser, path: '/vendors' },
    // { name: 'Inventory', icon: FaTruck, path: '/inventory' },
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
        <div className="logo text-center mb-4">
          <button onClick={toggleSidebar} className="text-xl text-[#0D2240]">
            <FaBars />
          </button>
        </div>

        <ul className="menu space-y-2">
          {menuItems.map((item) => (
            <Link to={item.path} key={item.name}>
              <li
                className={`menu-item flex items-center p-2 rounded-lg ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                } ${
                  location.pathname === item.path
                    ? 'bg-[#0D2240] text-white'
                    : 'hover:bg-[#FF6B35] hover:text-white text-[#0D2240]'
                }`}
              >
                <item.icon className="text-lg" />
                {!isCollapsed && <span className="text-sm">{item.name}</span>}
              </li>
            </Link>
          ))}
        </ul>

        {/* Profile */}
        <div className={`profile mt-8 flex items-center text-[#0D2240] ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <FaUser className="text-xl" />
          {!isCollapsed && (
            <div>
              <h3 className="text-sm font-bold">{profile.name}</h3>
              <p className="text-xs text-gray-600">{profile.email}</p>
            </div>
          )}
        </div>

        {/* Settings & Logout */}
        <div className={`settings mt-4 flex items-center cursor-pointer ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <FaCog className="text-lg text-[#0D2240] hover:text-[#FF6B35]" />
          {!isCollapsed && <span className="text-sm text-[#0D2240] hover:text-[#FF6B35]">Settings</span>}
        </div>

        <div className={`logout mt-4 flex items-center cursor-pointer ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <FaSignOutAlt className="text-lg text-red-500 hover:text-[#FF6B35]" />
          {!isCollapsed && <span className="text-sm text-red-500 hover:text-[#FF6B35]">Logout</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">{children}</div>
    </div>
  );
}

export default Navigation;

