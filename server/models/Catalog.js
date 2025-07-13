const mongoose = require('mongoose');

const CatalogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  color: String,
  createdAt: { type: Date, default: Date.now },
  openapiSpec: Object,
},{ timestamps: true });

module.exports = mongoose.model('Catalog', CatalogSchema);
