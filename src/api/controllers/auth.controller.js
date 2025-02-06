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

    // Cek akun dengan NIS dan ambil data siswa sekaligus
    const [auth, siswa] = await Promise.all([
      Auth.findOne({ nis }),
      Siswa.findOne({ nis })
    ]);

    if (!auth || !siswa) {
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

    // Generate token dengan NISN
    const token = jwt.sign(
      { 
        nis: auth.nis,
        nisn: siswa.nisn,
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
          nis: siswa.nis,
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