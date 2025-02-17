import Guru from '../models/Guru.models.js';

// Get all guru
export const getAllGuru = async (req, res) => {
  try {
    const guru = await Guru.find();
    res.status(200).json(guru);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get guru by ID
export const getGuruById = async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);
    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' });
    }
    res.status(200).json(guru);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new guru
export const createGuru = async (req, res) => {
  const guru = new Guru(req.body);
  try {
    const newGuru = await guru.save();
    res.status(201).json(newGuru);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update guru
export const updateGuru = async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);
    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' });
    }
    
    Object.assign(guru, req.body);
    const updatedGuru = await guru.save();
    res.status(200).json(updatedGuru);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete guru
export const deleteGuru = async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);
    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' });
    }
    
    await guru.deleteOne();
    res.status(200).json({ message: 'Guru berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 