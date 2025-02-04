import Auth from '../models/Auth.models.js';
import Siswa from '../models/Siswa.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register siswa
export const register = async (req, res) => {
  try {
    const { nisn, password, nis, nama, kelas } = req.body;

    // Validasi input
    if (!nisn || !password || !nis || !nama || !kelas) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi'
      });
    }

    // Cek apakah NISN sudah terdaftar
    const existingAuth = await Auth.findOne({ nisn });
    if (existingAuth) {
      return res.status(400).json({
        success: false,
        message: 'NISN sudah terdaftar'
      });
    }

    // Cek apakah NIS sudah terdaftar
    const existingSiswa = await Siswa.findOne({ nis });
    if (existingSiswa) {
      return res.status(400).json({
        success: false,
        message: 'NIS sudah terdaftar'
      });
    }

    // Buat akun auth
    const auth = new Auth({
      nisn,
      password
    });

    // Buat data siswa
    const siswa = new Siswa({
      nisn,
      nis,
      nama,
      kelas
    });

    await auth.save();
    await siswa.save();

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        nisn: siswa.nisn,
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

// Login siswa
export const login = async (req, res) => {
  try {
    const { nisn, password } = req.body;

    // Validasi input
    if (!nisn || !password) {
      return res.status(400).json({
        success: false,
        message: 'NISN dan password harus diisi'
      });
    }

    // Cek akun
    const auth = await Auth.findOne({ nisn });
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: 'NISN atau password salah'
      });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, auth.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'NISN atau password salah'
      });
    }

    // Ambil data siswa
    const siswa = await Siswa.findOne({ nisn });

    // Generate token
    const token = jwt.sign(
      { 
        nisn: auth.nisn,
        role: auth.role
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
          nisn: siswa.nisn,
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