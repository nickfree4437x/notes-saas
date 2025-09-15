const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // ex: acme, globex
  plan: { type: String, enum: ['free', 'pro'], default: 'free' }, // subscription
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);
