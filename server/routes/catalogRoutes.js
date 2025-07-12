const express = require('express');
const router = express.Router();
const Catalog = require('../models/Catalog');
const Api = require('../models/Api');

// Get all catalogs
router.get('/', async (req, res) => {
  try {
    const catalogs = await Catalog.find();
    res.json(catalogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a catalog
router.post('/', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const catalog = new Catalog({ name, description, color });
    await catalog.save();
    res.status(201).json(catalog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all APIs in a catalog
router.get('/:catalogId/apis', async (req, res) => {
  try {
    const apis = await Api.find({ catalogId: req.params.catalogId });
    res.json(apis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new API to a catalog
router.post('/:catalogId/apis', async (req, res) => {
  try {
    const { name, endpoint, method, description, version, status, tags,openapiSpec } = req.body;
    const api = new Api({
      catalogId: req.params.catalogId,
      name,
      endpoint,
      method,
      description,
      version,
      status,
      tags,
      openapiSpec
    });
    await api.save();
    res.status(201).json(api);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit Catalog
router.put('/:catalogId', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const updated = await Catalog.findByIdAndUpdate(
      req.params.catalogId,
      { name, description, color, updatedAt: Date.now() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Catalog (and its APIs)
router.delete('/:catalogId', async (req, res) => {
  try {
    await Api.deleteMany({ catalogId: req.params.catalogId });
    await Catalog.findByIdAndDelete(req.params.catalogId);
    res.json({ message: "Catalog and its APIs deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
