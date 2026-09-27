import Pricing from '../models/Pricing.js';

export const getAllPricing = async (req, res) => {
  try {
    const pricing = await Pricing.find({ active: true }).sort({ order: 1 });
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch pricing: ${error.message}` });
  }
};

export const createPricing = async (req, res) => {
  try {
    const pricing = await Pricing.create(req.body);
    res.status(201).json(pricing);
  } catch (error) {
    res.status(500).json({ message: `Failed to create pricing: ${error.message}` });
  }
};

export const updatePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!pricing) {
      return res.status(404).json({ message: 'Pricing package not found' });
    }
    
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: `Failed to update pricing: ${error.message}` });
  }
};

export const deletePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndDelete(req.params.id);
    
    if (!pricing) {
      return res.status(404).json({ message: 'Pricing package not found' });
    }
    
    res.json({ message: 'Pricing package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete pricing: ${error.message}` });
  }
};
