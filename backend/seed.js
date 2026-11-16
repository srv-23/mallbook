const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const moment = require('moment');
const Store = require('./models/Store');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const { applyDnsOverride, isDnsFailure, dnsHint } = require('./utils/dns');

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

// Demo customers so the admin Users screen has something to show on day one.
const demoCustomers = [
  { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '9810012301' },
  { name: 'Diya Patel', email: 'diya@example.com', phone: '9810012302' },
  { name: 'Kabir Singh', email: 'kabir@example.com', phone: '9810012303' },
  { name: 'Meera Iyer', email: 'meera@example.com', phone: '9810012304' },
  { name: 'Rohan Gupta', email: 'rohan@example.com', phone: '9810012305' },
  { name: 'Sana Khan', email: 'sana@example.com', phone: '9810012306' },
];

// A fixed spread of bookings around today so the dashboard charts, revenue
// cards and "my bookings" page are not empty. Offsets are relative to the day
// the seed runs, which keeps the demo meaningful whenever it is executed.
const demoBookings = [
  { dayOffset: -9, time: '11:00', people: 2, status: 'completed' },
  { dayOffset: -8, time: '16:00', people: 1, status: 'completed' },
  { dayOffset: -7, time: '13:00', people: 3, status: 'completed' },
  { dayOffset: -6, time: '18:00', people: 2, status: 'cancelled' },
  { dayOffset: -5, time: '12:00', people: 1, status: 'completed' },
  { dayOffset: -4, time: '15:00', people: 4, status: 'completed' },
  { dayOffset: -3, time: '10:30', people: 2, status: 'no_show' },
  { dayOffset: -2, time: '17:00', people: 2, status: 'completed' },
  { dayOffset: -1, time: '14:00', people: 1, status: 'confirmed' },
  { dayOffset: 0, time: '11:30', people: 2, status: 'confirmed' },
  { dayOffset: 0, time: '16:30', people: 3, status: 'pending' },
  { dayOffset: 1, time: '12:30', people: 2, status: 'pending' },
  { dayOffset: 2, time: '19:00', people: 1, status: 'confirmed' },
  { dayOffset: 3, time: '13:30', people: 4, status: 'pending' },
  { dayOffset: 5, time: '18:30', people: 2, status: 'pending' },
];

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

// Build (but do not save) a demo booking. Kept separate from the insert loop so
// the shape can be validated against the schema without a database.
const buildBooking = ({ plan, service, customer, today }) => ({
  user: customer._id,
  service: service._id,
  store: service.store,
  date: today.clone().add(plan.dayOffset, 'day').toDate(),
  time: plan.time,
  endTime: toTime(toMinutes(plan.time) + Number(service.duration)),
  duration: service.duration,
  numberOfPeople: plan.people,
  totalPrice: service.price * plan.people,
  status: plan.status,
  paymentStatus:
    plan.status === 'cancelled'
      ? 'refunded'
      : ['confirmed', 'completed'].includes(plan.status)
        ? 'paid'
        : 'pending',
  specialRequests: '',
  notes: ''
});

async function seed() {
  // mongodb+srv:// URIs need an SRV lookup; honour DNS_SERVERS before connecting.
  applyDnsOverride();

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  } catch (error) {
    console.error('❌ Could not connect to MongoDB:', error.message.split('\n')[0]);
    if (isDnsFailure(error)) console.error(dnsHint(process.env.MONGODB_URI));
    throw error;
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@mall.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
  const managerEmail = process.env.SEED_MANAGER_EMAIL || 'manager@mall.com';
  const managerPassword = process.env.SEED_MANAGER_PASSWORD || 'Manager@12345';
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD || 'Customer@12345';

  // Bookings reference users, stores and services, so they are cleared first.
  await Booking.deleteMany({});
  await Store.deleteMany({});
  await Service.deleteMany({});

  // Re-create the demo accounts from scratch so re-running the seed never trips
  // the unique email index. Passwords come from the environment so a seeded
  // production database does not end up with the documented defaults.
  const demoEmails = [adminEmail, managerEmail, ...demoCustomers.map((c) => c.email)];
  await User.deleteMany({ email: { $in: demoEmails } });

  const admin = await User.create({
    name: 'Mall Admin',
    email: adminEmail,
    password: adminPassword,
    phone: '9999999998',
    role: 'admin',
    isVerified: true,
  });

  const manager = await User.create({
    name: 'Mall Manager',
    email: managerEmail,
    password: managerPassword,
    phone: '9999999999',
    role: 'store_manager',
    isVerified: true,
  });

  const customers = [];
  for (const customer of demoCustomers) {
    customers.push(
      await User.create({
        ...customer,
        password: customerPassword,
        role: 'customer',
      })
    );
  }

  // Create stores
  const stores = [];
  for (const s of sampleStores) {
    const floorObj = floors.find((f) => f.number === s.floor);
    const store = await Store.create({
      name: s.name,
      description: `${s.name} on ${floorObj.label}`,
      category: s.category,
      location: {
        floor: s.floor,
        unit: `U${stores.length + 1}`,
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

  // Create one service per store
  const services = [];
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    const serviceData = sampleServices[i % sampleServices.length];
    const service = await Service.create({
      ...serviceData,
      store: store._id,
      capacity: 10,
      isActive: true,
      availability: defaultAvailability,
      rating: { average: 0, count: 0 },
    });
    services.push(service);
  }

  // Bookings are written directly rather than through POST /api/bookings: the
  // route rejects past dates, and a demo history is the whole point here.
  const today = moment().startOf('day');

  for (let i = 0; i < demoBookings.length; i++) {
    const plan = demoBookings[i];
    const service = services[i % services.length];
    const customer = customers[i % customers.length];

    await Booking.create(buildBooking({ plan, service, customer, today }));
  }

  const counts = {
    users: await User.countDocuments(),
    stores: await Store.countDocuments(),
    services: await Service.countDocuments(),
    bookings: await Booking.countDocuments(),
  };

  console.log('\nDatabase seeded with demo mall data.');
  console.log(`  admin    ${admin._id}  ${admin.name}`);
  console.log(`  manager  ${manager._id}  ${manager.name} (manages ${stores.length} stores)`);
  console.log(`  ${customers.length} demo customers, ${services.length} services, ${demoBookings.length} bookings\n`);
  console.log(`  users ${counts.users} | stores ${counts.stores} | services ${counts.services} | bookings ${counts.bookings}\n`);
  console.log('  Sign in with:');
  console.log(`    Admin:         ${adminEmail} / ${adminPassword}`);
  console.log(`    Store manager: ${managerEmail} / ${managerPassword}`);
  console.log(`    Customer:      ${demoCustomers[0].email} / ${customerPassword}`);
  console.log('    (all demo customers share the customer password)\n');
}

if (require.main === module) {
  seed()
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = {
  seed,
  buildBooking,
  demoCustomers,
  demoBookings,
  sampleStores,
  sampleServices,
  defaultAvailability,
  defaultOperatingHours
};
