import Admin from '../models/Admin.models.js';
import Auth from '../models/Auth.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        email: admin.email,
        jenisKelamin: admin.jenisKelamin,
        noTelp: admin.noTelp,
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
    const { nama, email, jenisKelamin, noTelp } = req.body;

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
    if (nama) admin.nama = nama;
    if (email) admin.email = email;
    if (jenisKelamin) admin.jenisKelamin = jenisKelamin;
    if (noTelp) admin.noTelp = noTelp;

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: {
        nip: admin.nip,
        nama: admin.nama,
        email: admin.email,
        jenisKelamin: admin.jenisKelamin,
        noTelp: admin.noTelp
      }
    });

  } catch (error) {
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