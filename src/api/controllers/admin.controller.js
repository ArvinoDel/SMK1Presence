import Admin from '../models/Admin.models.js';
import Auth from '../models/Auth.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Siswa from '../models/Siswa.models.js';
import Guru from '../models/Guru.models.js';
import path from 'path';
import fs from 'fs/promises';

// Register admin
export const registerAdmin = async (req, res) => {
  try {
    const { nip, password, nama, email, jenisKelamin, noTelp } = req.body;

    // Validasi input
    if (!nip || !password || !nama || !email) {
      return res.status(400).json({
        success: false,
        message: 'NIP, password, nama, dan email harus diisi'
      });
    }

    // Cek apakah NIP sudah terdaftar di Auth
    const existingAuth = await Auth.findOne({ nis: nip });
    if (existingAuth) {
      return res.status(400).json({
        success: false,
        message: 'NIP sudah terdaftar'
      });
    }

    // Cek apakah NIP atau email sudah terdaftar di Admin
    const existingAdmin = await Admin.findOne({
      $or: [{ nip }, { email }]
    });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'NIP atau email sudah terdaftar'
      });
    }

    // Buat akun auth dengan NIP sebagai identifier
    const auth = new Auth({
      nis: nip,
      password,
      role: 'admin'
    });

    // Buat data admin
    const admin = new Admin({
      nip,
      nama,
      email,
      jenisKelamin,
      noTelp
    });

    await auth.save();
    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Registrasi admin berhasil',
      data: {
        nip: admin.nip,
        nama: admin.nama,
        email: admin.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan registrasi admin',
      error: error.message
    });
  }
};

// Get admin profile
export const getProfile = async (req, res) => {
  try {
    const { identifier, role } = req.user;

    // Pastikan user adalah admin
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const admin = await Admin.findOne({ nip: identifier });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Data admin tidak ditemukan'
      });
    }

    // Create full URLs for photos
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const photoUrl = admin.photo ? `${baseUrl}${admin.photo}` : null;
    const coverPhotoUrl = admin.coverPhoto ? `${baseUrl}${admin.coverPhoto}` : null;

    res.status(200).json({
      success: true,
      data: {
        nip: admin.nip,
        nama: admin.nama,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        jenisKelamin: admin.jenisKelamin,
        noTelp: admin.noTelp,
        alamat: {
          street: admin.alamat?.street || '',
          city: admin.alamat?.city || '',
          state: admin.alamat?.state || '',
          postalCode: admin.alamat?.postalCode || ''
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

// Update admin profile
export const updateProfile = async (req, res) => {
  try {
    const { identifier, role } = req.user;
    const { firstName, lastName, email, jenisKelamin, noTelp } = req.body;
    const alamat = req.body.alamat ? JSON.parse(req.body.alamat) : {};

    // Pastikan user adalah admin
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const admin = await Admin.findOne({ nip: identifier });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Data admin tidak ditemukan'
      });
    }

    // Update fields
    const updateData = {
      firstName: firstName || admin.firstName,
      lastName: lastName || admin.lastName,
      email: email || admin.email,
      jenisKelamin: jenisKelamin || admin.jenisKelamin,
      noTelp: noTelp || admin.noTelp,
      alamat: {
        street: alamat.street || admin.alamat?.street || '',
        city: alamat.city || admin.alamat?.city || '',
        state: alamat.state || admin.alamat?.state || '',
        postalCode: alamat.postalCode || admin.alamat?.postalCode || ''
      },
      updatedAt: new Date()
    };

    // Handle photo uploads
    if (req.files) {
      if (req.files.photo) {
        updateData.photo = `/uploads/profilepicture/${req.files.photo[0].filename}`;
        
        // Delete old photo if exists
        if (admin.photo) {
          const oldPhotoPath = path.join(process.cwd(), 'public', admin.photo);
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
        if (admin.coverPhoto) {
          const oldCoverPath = path.join(process.cwd(), 'public', admin.coverPhoto);
          try {
            await fs.access(oldCoverPath);
            await fs.unlink(oldCoverPath);
          } catch (error) {
            console.log('Old cover photo not found:', error.message);
          }
        }
      }
    }

    // Update admin data
    const updatedAdmin = await Admin.findOneAndUpdate(
      { nip: identifier },
      { $set: updateData },
      { new: true }
    );

    // Create full URLs for photos
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const photoUrl = updatedAdmin.photo ? `${baseUrl}${updatedAdmin.photo}` : null;
    const coverPhotoUrl = updatedAdmin.coverPhoto ? `${baseUrl}${updatedAdmin.coverPhoto}` : null;

    res.status(200).json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: {
        ...updatedAdmin.toObject(),
        photo: photoUrl,
        coverPhoto: coverPhotoUrl
      }
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

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const { role } = req.user;

    // Pastikan user adalah admin
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const admins = await Admin.find().select('-__v');
    
    res.status(200).json({
      success: true,
      data: admins
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data admin',
      error: error.message
    });
  }
};

// Get all users (siswa dan guru)
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.user;

    // Pastikan user adalah admin
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const siswa = await Siswa.find().select('-__v');
    const waliKelas = await Guru.find().select('-__v');

    const users = [
      ...siswa.map(s => ({
        ...s.toObject(),
        isGuru: false,
        role: s.kelas
      })),
      ...waliKelas.map(g => ({
        ...g.toObject(),
        isGuru: true,
        role: `Wali Kelas ${g.kelas}`
      }))
    ];
    
    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data users',
      error: error.message
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { role } = req.user;
    const userId = req.params.id;
    const updateData = req.body;

    // Pastikan user adalah admin
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    // Cek apakah user yang akan diupdate adalah siswa atau guru
    let updatedUser;
    let identifier;

    if (updateData.role === 'siswa') {
      // Update data siswa
      updatedUser = await Siswa.findByIdAndUpdate(
        userId,
        {
          nama: updateData.nama,
          email: updateData.email,
          nis: updateData.nis,
          nisn: updateData.nisn,
          kelas: updateData.kelas
        },
        { new: true }
      );
      identifier = updatedUser.nis;
    } else if (updateData.role === 'guru') {
      // Update data guru
      updatedUser = await Guru.findByIdAndUpdate(
        userId,
        {
          nama: updateData.nama,
          email: updateData.email,
          nip: updateData.nip,
          mataPelajaran: updateData.mataPelajaran
        },
        { new: true }
      );
      identifier = updatedUser.nip;

      if (updateData.kelas) {
        // Cek apakah kelas yang baru sudah memiliki wali kelas
        const existingWaliKelas = await Guru.findOne({
          kelas: updateData.kelas,
          _id: { $ne: userId } // Exclude current user
        });

        if (existingWaliKelas) {
          return res.status(400).json({
            success: false,
            message: `Kelas ${updateData.kelas} sudah memiliki wali kelas (${existingWaliKelas.nama})`
          });
        }
      }
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Update password if provided
    if (updateData.password) {
      const auth = await Auth.findOne({ nis: identifier });
      if (auth) {
        auth.password = updateData.password;
        await auth.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'User berhasil diupdate',
      data: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate user',
      error: error.message
    });
  }
};

// Delete user (siswa atau guru)
export const deleteUser = async (req, res) => {
  try {
    const { role } = req.user;
    const userId = req.params.id;
    const userRole = req.query.role; // 'siswa' atau 'guru'

    // Pastikan user adalah admin
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    let deletedUser;
    let authIdentifier;

    // Hapus user berdasarkan role
    if (userRole === 'siswa') {
      deletedUser = await Siswa.findById(userId);
      if (deletedUser) {
        authIdentifier = deletedUser.nis;
        await deletedUser.deleteOne();
      }
    } else if (userRole === 'guru') {
      deletedUser = await Guru.findById(userId);
      if (deletedUser) {
        authIdentifier = deletedUser.nip;
        await deletedUser.deleteOne();
      }
    }

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Hapus data auth terkait
    await Auth.findOneAndDelete({ nis: authIdentifier });

    res.status(200).json({
      success: true,
      message: 'User berhasil dihapus'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus user',
      error: error.message
    });
  }
};

// Create new user (siswa atau guru) by admin
export const createUser = async (req, res) => {
  try {
    const { role } = req.user;
    const { nis, nisn, nip, password, nama, kelas, email, mataPelajaran } = req.body;

    // Pastikan user adalah admin
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    // Buat akun auth
    const auth = new Auth({
      nis: req.body.role === 'siswa' ? nis : nip, // gunakan NIS untuk siswa, NIP untuk guru
      password: password, // Password akan di-hash oleh middleware pre-save
      role: req.body.role
    });

    // Buat data user berdasarkan role
    let user;
    if (req.body.role === 'siswa') {
      // Validasi format NIS
      if (!/^\d{8}$/.test(nis)) {
        return res.status(400).json({
          success: false,
          message: 'NIS harus terdiri dari 8 digit angka'
        });
      }

      // Validasi format NISN
      if (!/^\d{10}$/.test(nisn)) {
        return res.status(400).json({
          success: false,
          message: 'NISN harus terdiri dari 10 digit angka'
        });
      }

      // Cek duplikat untuk siswa
      const existingSiswa = await Siswa.findOne({
        $or: [{ nis }, { nisn }, { email }]
      });
      if (existingSiswa) {
        return res.status(400).json({
          success: false,
          message: 'NIS, NISN, atau email sudah terdaftar'
        });
      }

      user = new Siswa({
        nis,
        nisn,
        nama,
        kelas,
        email
      });
    } else if (req.body.role === 'guru') {
      // Cek apakah kelas sudah memiliki wali kelas
      const existingWaliKelas = await Guru.findOne({
        kelas: req.body.kelas
      });
      
      if (existingWaliKelas) {
        return res.status(400).json({
          success: false,
          message: `Kelas ${req.body.kelas} sudah memiliki wali kelas (${existingWaliKelas.nama})`
        });
      }

      user = new Guru({
        nip: req.body.nip,
        nama: req.body.nama,
        email: req.body.email,
        kelas: req.body.kelas,
        mataPelajaran: req.body.mataPelajaran
      });
    }

    await auth.save();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User berhasil dibuat',
      data: {
        nama: user.nama,
        email: user.email,
        role: req.body.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat user',
      error: error.message
    });
  }
};

// Get all kelas from Guru collection
export const getAllKelas = async (req, res) => {
  try {
    // Ambil semua kelas unik dari collection Guru
    const kelasList = await Guru.distinct('kelas');
    
    // Filter out null/empty values dan urutkan
    const filteredKelas = kelasList
      .filter(kelas => kelas)
      .sort();
    
    res.status(200).json({
      success: true,
      data: filteredKelas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar kelas',
      error: error.message
    });
  }
}; 