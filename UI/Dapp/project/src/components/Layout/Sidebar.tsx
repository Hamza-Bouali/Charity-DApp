import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { useTheme } from '../../context/ThemeContext';
import { Home, BarChart3, Heart, PiggyBank, Users, Settings, Moon, Sun } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { isConnected, isAdmin, isCharity, account } = useWeb3();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/campaigns', label: 'Campaigns', icon: <BarChart3 size={20} /> },
    { to: '/donate', label: 'Donate', icon: <Heart size={20} /> },
  ];

  // Additional items for charities
  const charityItems = [
    { to: '/my-campaigns', label: 'My Campaigns', icon: <PiggyBank size={20} /> }
  ];

  // Additional items for admins
  const adminItems = [
    { to: '/admin', label: 'Admin Panel', icon: <Settings size={20} /> },
    { to: '/charity-requests', label: 'Charity Requests', icon: <Users size={20} /> }
  ];

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Charity DApp</h1>
        {isConnected && account && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
            {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </p>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        
        {isCharity && (
          <>
            <div className="mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase">
              Charity Tools
            </div>
            {charityItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}
        
        {isAdmin && (
          <>
            <div className="mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase">
              Administration
            </div>
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}
        
        <NavLink
          to="/charity-registration"
          className={({ isActive }) => 
            `flex items-center px-4 py-3 text-sm rounded-lg transition-colors mt-6 ${
              isActive 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
            }`
          }
        >
          <span className="mr-3"><Users size={20} /></span>
          Register Charity
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'dark' ? (
            <><Sun size={16} className="mr-2" /> Light Mode</>
          ) : (
            <><Moon size={16} className="mr-2" /> Dark Mode</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;