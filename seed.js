require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Store = require('./models/Store');
const User = require('./models/User');

const floors = [
  { label: 'Lower Ground Floor', number: -1 },
  { label: 'Ground Floor', number: 0 },
  { label: 'First Floor', number: 1 },
  { label: 'Second Floor', number: 2 },
  { label: 'Third Floor', number: 3 },
  { label: 'Fourth Floor', number: 4 },
  { label: 'Terrace/Food Court', number: 5 },
];

const storeCategories = [
  'fashion', 'electronics', 'food', 'beauty', 'entertainment', 'services', 'other'
];

const serviceCategories = [
  'restaurant', 'entertainment', 'beauty', 'fitness', 'shopping', 'services', 'facilities'
];

const sampleStores = [
  { name: 'Big Bazaar', category: 'food', floor: 0 },
  { name: 'PVR Cinemas', category: 'entertainment', floor: 2 },
  { name: 'Shoppers Stop', category: 'fashion', floor: 1 },
  { name: 'Croma', category: 'electronics', floor: 1 },
  { name: 'Lakme Salon', category: 'beauty', floor: 3 },
  { name: 'Fun City', category: 'entertainment', floor: 4 },
  { name: 'HDFC Bank ATM', category: 'services', floor: -1 },
  { name: 'Food Court', category: 'food', floor: 5 },
  { name: 'Pantaloons', category: 'fashion', floor: 0 },
  { name: 'Reliance Digital', category: 'electronics', floor: 2 },
  { name: 'Barbeque Nation', category: 'food', floor: 3 },
  { name: 'VLCC Wellness', category: 'beauty', floor: 2 },
  { name: 'INOX', category: 'entertainment', floor: 5 },
  { name: 'ICICI Bank ATM', category: 'services', floor: -1 },
  { name: 'Decathlon', category: 'other', floor: 4 },
  { name: 'Westside', category: 'fashion', floor: 2 },
  { name: 'Samsung SmartCafe', category: 'electronics', floor: 3 },
  { name: 'KFC', category: 'food', floor: 1 },
  { name: 'Enrich Salon', category: 'beauty', floor: 0 },
  { name: 'Timezone', category: 'entertainment', floor: 3 },
  { name: 'Axis Bank ATM', category: 'services', floor: 0 },
  { name: 'Hamleys', category: 'other', floor: 1 },
  { name: "Levi's", category: 'fashion', floor: 3 },
  { name: 'Sony Center', category: 'electronics', floor: 4 },
  { name: 'Pizza Hut', category: 'food', floor: 4 },
  { name: 'Naturals Salon', category: 'beauty', floor: 5 },
  { name: 'Smaaash', category: 'entertainment', floor: 1 },
  { name: 'SBI Bank ATM', category: 'services', floor: 2 },
  { name: 'Miniso', category: 'other', floor: 5 },
  { name: 'Biba', category: 'fashion', floor: 5 },
  { name: 'Apple Store', category: 'electronics', floor: 5 },
  { name: "McDonald's", category: 'food', floor: 2 },
  { name: 'Javed Habib', category: 'beauty', floor: 4 },
  { name: 'Snow World', category: 'entertainment', floor: 0 },
  { name: 'HDFC Bank ATM 2', category: 'services', floor: 3 },
  { name: 'Archies', category: 'other', floor: 2 },
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
    price: 300,
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