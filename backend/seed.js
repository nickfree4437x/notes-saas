require('dotenv').config();
const mongoose = require('mongoose');
const Tenant = require('./models/Tenant');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await Tenant.deleteMany();
  await User.deleteMany();

  const acme = await Tenant.create({ name: 'Acme', slug: 'acme', plan: 'free' });
  const globex = await Tenant.create({ name: 'Globex', slug: 'globex', plan: 'free' });

  const users = [
    { email: 'admin@acme.test', password: 'password', role: 'admin', tenantId: acme._id },
    { email: 'user@acme.test', password: 'password', role: 'member', tenantId: acme._id },
    { email: 'admin@globex.test', password: 'password', role: 'admin', tenantId: globex._id },
    { email: 'user@globex.test', password: 'password', role: 'member', tenantId: globex._id },
  ];

  for (let u of users) await User.create(u);

  console.log('Seed completed!');
  mongoose.disconnect();
}

seed();
