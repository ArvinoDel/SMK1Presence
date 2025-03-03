import Guru from '../models/Guru.models.js';
import fs from 'fs/promises';
import path from 'path';

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
    const guru = await Guru.findOneAndUpdate(
      { nip: req.params.nip },
      { $set: req.body },
      { new: true }
    );
    
    if (!guru) {
      return res.status(404).json({
        success: false,
        message: 'Guru tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Data guru berhasil diupdate',
      data: guru
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
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

// Get profile data
export const getProfile = async (req, res) => {
  try {
    const { identifier } = req.user;

    const guru = await Guru.findOne({ nip: identifier });
    if (!guru) {
      return res.status(404).json({
        success: false,
        message: 'Data guru tidak ditemukan'
      });
    }

    // Create full URLs for photos
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const photoUrl = guru.photo ? `${baseUrl}${guru.photo}` : null;
    const coverPhotoUrl = guru.coverPhoto ? `${baseUrl}${guru.coverPhoto}` : null;

    res.status(200).json({
      success: true,
      data: {
        nip: guru.nip,
        nama: guru.nama,
        kelas: guru.kelas,
        jenisKelamin: guru.jenisKelamin,
        tanggalLahir: guru.tanggalLahir,
        mataPelajaran: guru.mataPelajaran,
        pendidikanTerakhir: guru.pendidikanTerakhir,
        firstName: guru.firstName,
        lastName: guru.lastName,
        email: guru.email,
        alamat: {
          street: guru.alamat?.street,
          city: guru.alamat?.city,
          state: guru.alamat?.state,
          postalCode: guru.alamat?.postalCode
        },
        noTelp: guru.noTelp,
        photo: photoUrl,
        coverPhoto: coverPhotoUrl
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data profile',
      error: error.message
    });
  }
};

// Update profile data
export const updateProfile = async (req, res) => {
  try {
    const { identifier } = req.user;
    
    // Parse form data and alamat object
    const alamat = req.body.alamat ? JSON.parse(req.body.alamat) : {};
    
    const updateData = {
      nama: req.body.nama || '',
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
      email: req.body.email || '',
      jenisKelamin: req.body.jenisKelamin || '',
      mataPelajaran: req.body.mataPelajaran || '',
      pendidikanTerakhir: req.body.pendidikanTerakhir || '',
      noTelp: req.body.noTelp || '',
      alamat: {
        street: alamat.street || '',
        city: alamat.city || '',
        state: alamat.state || '',
        postalCode: alamat.postalCode || ''
      },
      updatedAt: new Date()
    };

    // Get existing user data
    const existingUser = await Guru.findOne({ nip: identifier });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Data guru tidak ditemukan'
      });
    }

    // Handle photo uploads
    if (req.files) {
      if (req.files.photo) {
        updateData.photo = `/uploads/profilepicture/${req.files.photo[0].filename}`;
        
        // Delete old photo if exists
        if (existingUser.photo) {
          const oldPhotoPath = path.join(process.cwd(), 'public', existingUser.photo);
          try {
            await fs.access(oldPhotoPath);
            await fs.unlink(oldPhotoPath);
          } catch (error) {
            console.log('Old photo not found:', error.message);
          }
        }
      }
      if (req.files.coverPhoto) {
        updateData.coverPhoto = `/uploads/profilepicture/${req.files.coverPhoto[0].filename}`;
        
        // Delete old cover photo if exists
        if (existingUser.coverPhoto) {
          const oldCoverPath = path.join(process.cwd(), 'public', existingUser.coverPhoto);
          try {
            await fs.access(oldCoverPath);
            await fs.unlink(oldCoverPath);
          } catch (error) {
            console.log('Old cover photo not found:', error.message);
          }
        }
      }
    }

    // Update user data
    const updatedGuru = await Guru.findOneAndUpdate(
      { nip: identifier },
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: updatedGuru
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate profile',
      error: error.message
    });
  }
}; 