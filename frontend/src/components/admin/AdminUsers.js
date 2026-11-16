import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaSearch, FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import AdminTabs from './AdminTabs';
import { useAuth } from '../../contexts/AuthContext';

const ROLES = [
  { value: 'customer', label: 'Customer', icon: FaUser, badge: 'badge badge-info' },
  { value: 'store_manager', label: 'Store Manager', icon: FaUserTie, badge: 'badge badge-warning' },
  { value: 'admin', label: 'Admin', icon: FaUserShield, badge: 'badge badge-danger' }
];

const roleMeta = (role) => ROLES.find((r) => r.value === role) || ROLES[0];

const AdminUsers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const { data: users = [], isLoading, isError } = useQuery('users', async () => {
    const res = await axios.get('/api/users');
    return res.data;
  });

  const updateRole = useMutation(
    ({ id, role }) => axios.put(`/api/users/${id}`, { role }),
    {
      onSuccess: (res) => {
        // The role lives on the account, so the server is the source of truth:
        // refetch instead of patching the cached list by hand.
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('adminDashboard');
        toast.success(`${res.data.user.name} is now ${roleMeta(res.data.user.role).label}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Could not update the role');
      }
    }
  );

  const handleRoleChange = (target, role) => {
    if (role === target.role) return;
    updateRole.mutate({ id: target._id, role });
  };

  const term = search.trim().toLowerCase();
  const visibleUsers = users.filter((u) => {
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesSearch =
      !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    return matchesRole && matchesSearch;
  });

  const counts = ROLES.reduce(
    (acc, role) => ({ ...acc, [role.value]: users.filter((u) => u.role === role.value).length }),
    {}
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-indigo-700 mb-2">
            User Management
          </h1>
          <p className="text-gray-600 text-lg">
            Roles are stored on the account and checked on every API request. Changing a role
            takes effect on the user&apos;s next request; they do not need to sign in again.
          </p>
        </motion.div>

        <AdminTabs />

        {isError ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center">
            <FaUserShield className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700">Could not load users</p>
            <p className="text-gray-500 text-sm mt-2">
              Admin access is required. Check that the API is running and try again.
            </p>
          </div>
        ) : isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Role summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total users', value: users.length, icon: FaUser, color: 'from-blue-500 to-blue-600' },
                ...ROLES.map((role) => ({
                  label: role.label + 's',
                  value: counts[role.value] || 0,
                  icon: role.icon,
                  color:
                    role.value === 'admin'
                      ? 'from-red-500 to-red-600'
                      : role.value === 'store_manager'
                        ? 'from-orange-500 to-orange-600'
                        : 'from-green-500 to-green-600'
                }))
              ].map((card, idx) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-gradient-to-br ${card.color} rounded-lg shadow-lg p-5 text-white`}
                >
                  <card.icon className="text-2xl mb-2 opacity-80" />
                  <p className="text-sm font-semibold opacity-90">{card.label}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  className="form-input pl-10"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="form-select md:max-w-[220px]"
              >
                <option value="">All roles</option>
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Users table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left font-bold text-gray-700">User</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Phone</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Joined</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Role</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleUsers.map((u, idx) => {
                      const meta = roleMeta(u.role);
                      const isSelf = String(u._id) === String(user?.id);
                      const isSaving =
                        updateRole.isLoading && updateRole.variables?.id === u._id;

                      return (
                        <motion.tr
                          key={u._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">
                              {u.name}
                              {isSelf && (
                                <span className="ml-2 text-xs font-medium text-blue-600">(you)</span>
                              )}
                            </p>
                            <p className="text-gray-500 text-xs">{u.email}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={meta.badge}>{meta.label}</span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={u.role}
                              disabled={isSelf || isSaving}
                              onChange={(e) => handleRoleChange(u, e.target.value)}
                              title={
                                isSelf
                                  ? 'You cannot change your own role'
                                  : `Change role for ${u.name}`
                              }
                              className="text-sm rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              {ROLES.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {visibleUsers.length === 0 && (
                <p className="text-center text-gray-500 py-12">
                  No users match this filter.
                </p>
              )}

              <p className="text-xs text-gray-500 mt-4">
                Hiding links is not security: every protected endpoint re-reads the role from the
                database, so a customer who navigates to <code>/admin</code> still gets a 403 from
                the API. Your own role is not editable, and the last remaining admin cannot be
                demoted.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
