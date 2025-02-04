import Auth from '../models/Auth.models.js';
import Siswa from '../models/Siswa.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register siswa
export const register = async (req, res) => {
  try {
    const { nis, nisn, password, nama, kelas } = req.body;

    // Validasi input
    if (!nis || !nisn || !password || !nama || !kelas) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi'
      });
    }

    // Cek apakah NIS atau NISN sudah terdaftar
    const existingAuth = await Auth.findOne({ nis });
    if (existingAuth) {
      return res.status(400).json({
        success: false,
        message: 'NIS sudah terdaftar'
      });
    }

    const existingSiswa = await Siswa.findOne({ 
      $or: [{ nis }, { nisn }] 
    });
    if (existingSiswa) {
      return res.status(400).json({
        success: false,
        message: 'NIS atau NISN sudah terdaftar'
      });
    }

    // Buat akun auth dengan NIS
    const auth = new Auth({
      nis,
      password
    });

    // Buat data siswa
    const siswa = new Siswa({
      nis,
      nisn,
      nama,
      kelas
    });

    await auth.save();
    await siswa.save();

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        nis: siswa.nis,
        nama: siswa.nama,
        kelas: siswa.kelas
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan registrasi',
      error: error.message
    });
  }
};

// Login siswa dengan NIS
export const login = async (req, res) => {
  try {
    const { nis, password } = req.body;

    // Validasi input
    if (!nis || !password) {
      return res.status(400).json({
        success: false,
        message: 'NIS dan password harus diisi'
      });
    }

    // Cek akun dengan NIS
    const auth = await Auth.findOne({ nis });
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: 'NIS atau password salah'
      });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, auth.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'NIS atau password salah'
      });
    }

    // Ambil data siswa
    const siswa = await Siswa.findOne({ nis });

    // Generate token dengan NISN untuk QR code
    const token = jwt.sign(
      { 
        nis: auth.nis,
        nisn: siswa.nisn, // Simpan NISN di token untuk generate QR code
        role: 'siswa'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          nis: siswa.nis,
          nama: siswa.nama,
          kelas: siswa.kelas
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan login',
      error: error.message
    });
  }
}; 