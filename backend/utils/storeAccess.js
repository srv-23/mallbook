const Store = require('../models/Store');

// A store manager may only touch the store they are assigned to.
// Admins bypass the ownership check because they administer every store.
const canManageStore = async (user, storeId) => {
  if (!user || !storeId) return false;
  if (user.role === 'admin') return true;
  if (user.role !== 'store_manager') return false;

  const store = await Store.findById(storeId).select('manager');
  if (!store || !store.manager) return false;

  return String(store.manager) === String(user._id || user.id);
};

const forbidden = (res, message = 'Not authorized to manage this store') =>
  res.status(403).json({ success: false, message });

module.exports = { canManageStore, forbidden };
