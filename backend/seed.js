const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Store = require('./models/Store');
const User = require('./models/User');
const Service = require('./models/Service');

const floors = [
  { label: 'Ground Floor', number: 0 },
  { label: 'First Floor', number: 1 },
  { label: 'Second Floor', number: 2 },
];

const storeCategories = [
  'fashion', 'electronics', 'food', 'beauty', 'entertainment', 'services', 'other'
];

const serviceCategories = [
  'restaurant', 'entertainment', 'beauty', 'fitness', 'shopping', 'services', 'facilities'
];

const sampleStores = [
  // GROUND FLOOR (0) - 7 stores
  { name: 'Pantaloons', category: 'fashion', floor: 0, price: 2500 },
  { name: 'KFC', category: 'food', floor: 0, price: 350 },
  { name: 'Enrich Salon', category: 'beauty', floor: 0, price: 600 },
  { name: 'HDFC Bank ATM', category: 'services', floor: 0, price: 0 },
  { name: 'Miniso', category: 'other', floor: 0, price: 500 },
  { name: 'Smaaash', category: 'entertainment', floor: 0, price: 400 },
  { name: "McDonald's", category: 'food', floor: 0, price: 300 },

  // FIRST FLOOR (1) - 6 stores
  { name: 'Shoppers Stop', category: 'fashion', floor: 1, price: 3500 },
  { name: 'Croma', category: 'electronics', floor: 1, price: 45000 },
  { name: 'VLCC Wellness', category: 'beauty', floor: 1, price: 800 },
  { name: 'Timezone', category: 'entertainment', floor: 1, price: 500 },
  { name: 'Pizza Hut', category: 'food', floor: 1, price: 450 },
  { name: 'Axis Bank ATM', category: 'services', floor: 1, price: 0 },

  // SECOND FLOOR (2) - 7 stores
  { name: 'PVR Cinemas', category: 'entertainment', floor: 2, price: 500 },
  { name: "Levi's", category: 'fashion', floor: 2, price: 4500 },
  { name: 'Apple Store', category: 'electronics', floor: 2, price: 99999 },
  { name: 'Lakme Salon', category: 'beauty', floor: 2, price: 700 },
  { name: 'Barbeque Nation', category: 'food', floor: 2, price: 1200 },
  { name: 'INOX', category: 'entertainment', floor: 2, price: 450 },
  { name: 'SBI Bank ATM', category: 'services', floor: 2, price: 0 },
];

const sampleServices = [
  {
    name: 'North Indian Thali',
    description: 'Delicious North Indian cuisine.',
    category: 'restaurant',
    price: 350,
    duration: 60,
    features: ['Veg', 'Non-Veg', 'Buffet'],
    images: [],
  },
  {
    name: 'Movie Screening',
    description: 'Latest Bollywood and Hollywood movies.',
    category: 'entertainment',
    price: 500,
    duration: 180,
    features: ['Recliner Seats', 'Dolby Atmos'],
    images: [],
  },
  {
    name: 'Haircut & Styling',
    description: 'Professional hair styling and grooming.',
    category: 'beauty',
    price: 500,
    duration: 45,
    features: ['Unisex', 'AC Salon'],
    images: [],
  },
  {
    name: 'Kids Play Zone',
    description: 'Safe and fun play area for kids.',
    category: 'entertainment',
    price: 200,
    duration: 60,
    features: ['Slides', 'Ball Pool'],
    images: [],
  },
  {
    name: 'ATM Withdrawal',
    description: '24x7 ATM service.',
    category: 'services',
    price: 0,
    duration: 15,
    features: ['Cash Withdrawal', 'Balance Inquiry'],
    images: [],
  },
  {
    name: 'Gadget Shopping',
    description: 'Latest electronics and gadgets.',
    category: 'shopping',
    price: 1000,
    duration: 30,
    features: ['Mobile', 'Laptop', 'Accessories'],
    images: [],
  },
];

const defaultAvailability = {
  monday: { open: '10:00', close: '22:00', isOpen: true },
  tuesday: { open: '10:00', close: '22:00', isOpen: true },
  wednesday: { open: '10:00', close: '22:00', isOpen: true },
  thursday: { open: '10:00', close: '22:00', isOpen: true },
  friday: { open: '10:00', close: '22:00', isOpen: true },
  saturday: { open: '10:00', close: '23:00', isOpen: true },
  sunday: { open: '10:00', close: '23:00', isOpen: true },
};

const defaultOperatingHours = { ...defaultAvailability };

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create a dummy store manager
  await User.deleteMany({ email: 'manager@mall.com' });
  const manager = await User.create({
    name: 'Mall Manager',
    email: 'manager@mall.com',
    password: 'manager123',
    phone: '9999999999',
    role: 'store_manager',
  });

  // Remove old stores and services
  await Store.deleteMany({});
  await Service.deleteMany({});

  // Create stores
  const stores = [];
  for (const s of sampleStores) {
    const floorObj = floors.find(f => f.number === s.floor);
    const store = await Store.create({
      name: s.name,
      description: `${s.name} on ${floorObj.label}`,
      category: s.category,
      location: {
        floor: s.floor,
        unit: 'U1',
        coordinates: { x: 0, y: 0 },
      },
      contact: {
        phone: '9999999999',
        email: 'contact@' + s.name.replace(/\s+/g, '').toLowerCase() + '.com',
        website: '',
      },
      manager: manager._id,
      logo: '',
      images: [],
      isActive: true,
      operatingHours: defaultOperatingHours,
      features: [],
    });
    stores.push(store);
  }

  // Create services for each store
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    const serviceData = sampleServices[i % sampleServices.length];
    await Service.create({
      ...serviceData,
      store: store._id,
      capacity: 10,
      isActive: true,
      availability: defaultAvailability,
      rating: { average: 0, count: 0 },
    });
  }

  console.log('Database seeded with Indian mall services and floors!');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); mongoose.disconnect(); }); 