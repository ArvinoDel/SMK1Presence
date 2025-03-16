import Siswa from '../models/Siswa.models.js';
import fs from 'fs/promises';
import path from 'path';

// Get profile data
export const getProfile = async (req, res) => {
  try {
    const { identifier, role } = req.user;

    // Pastikan user adalah siswa
    if (role !== 'siswa') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const siswa = await Siswa.findOne({ nis: identifier });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Create full URLs for photos
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const photoUrl = siswa.photo ? `${baseUrl}${siswa.photo}` : null;
    const coverPhotoUrl = siswa.coverPhoto ? `${baseUrl}${siswa.coverPhoto}` : null;

    res.status(200).json({
      success: true,
      data: {
        nis: siswa.nis,
        nisn: siswa.nisn,
        nama: siswa.nama,
        jenisKelamin: siswa.jenisKelamin,
        kelas: siswa.kelas,
        barcode: siswa.barcode,
        firstName: siswa.firstName,
        lastName: siswa.lastName,
        email: siswa.email,
        alamat: {
          street: siswa.alamat?.street,
          city: siswa.alamat?.city,
          state: siswa.alamat?.state,
          postalCode: siswa.alamat?.postalCode
        },
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
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
      email: req.body.email || '',
      jenisKelamin: req.body.jenisKelamin || '',
      alamat: {
        street: alamat.street || '',
        city: alamat.city || '',
        state: alamat.state || '',
        postalCode: alamat.postalCode || ''
      },
      updatedAt: new Date()
    };

    // Get existing user data
    const existingUser = await Siswa.findOne({ nis: identifier });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Handle photo uploads with correct path
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
    const updatedSiswa = await Siswa.findOneAndUpdate(
      { nis: identifier },
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: updatedSiswa
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