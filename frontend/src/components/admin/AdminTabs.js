import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartPie, FaUsers } from 'react-icons/fa';

const tabs = [
  { to: '/admin', label: 'Overview', icon: FaChartPie, end: true },
  { to: '/admin/users', label: 'Users', icon: FaUsers, end: false }
];

// Shared sub-navigation so both admin screens can reach each other.
const AdminTabs = () => (
  <div className="flex flex-wrap gap-2 mb-8">
    {tabs.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            isActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-700'
          }`
        }
      >
        <Icon />
        {label}
      </NavLink>
    ))}
  </div>
);

export default AdminTabs;
