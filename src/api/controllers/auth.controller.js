import Auth from '../models/Auth.models.js';
import Siswa from '../models/Siswa.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Guru from '../models/Guru.models.js';
import Admin from '../models/Admin.models.js';

// Register siswa
export const register = async (req, res) => {
  try {
    const { nis, nisn, password, nama, kelas, email } = req.body;

    // Validasi input
    if (!nis || !nisn || !password || !nama || !kelas || !email) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi'
      });
    }

    // Cek apakah NIS atau NISN sudah terdaftar
    const existingAuth = await Auth.findOne({ nis: nis });
    if (existingAuth) {
      return res.status(400).json({
        success: false,
        message: 'NIS sudah terdaftar'
      });
    }

    const existingSiswa = await Siswa.findOne({ 
      $or: [{ nis }, { nisn }, { email }] 
    });
    if (existingSiswa) {
      return res.status(400).json({
        success: false,
        message: 'NIS, NISN, atau email sudah terdaftar'
      });
    }

    // Buat akun auth dengan NIS sebagai identifier
    const auth = new Auth({
      nis: nis,
      password: password, // Password akan di-hash oleh middleware pre-save
      role: 'siswa'
    });

    // Buat data siswa
    const siswa = new Siswa({
      nis,
      nisn,
      nama,
      kelas,
      email
    });

    await auth.save();
    await siswa.save();

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        nis: siswa.nis,
        nama: siswa.nama,
        kelas: siswa.kelas,
        email: siswa.email
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

// Login function
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'nomor induk dan password harus diisi!'
      });
    }

    // Cari di Auth dengan nis (bisa berisi NIS, NIP, atau NIP admin)
    const auth = await Auth.findOne({
      $or: [
        { nis: identifier, role: 'siswa' },
        { nis: identifier, role: 'guru' },
        { nis: identifier, role: 'admin' }
      ]
    });
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: 'nomor induk atau password salah!'
      });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, auth.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'nomor induk atau password salah!'
      });
    }

    // Cari data lengkap user berdasarkan role
    let userData;
    if (auth.role === 'siswa') {
      userData = await Siswa.findOne({ nis: identifier });
    } else if (auth.role === 'guru') {
      userData = await Guru.findOne({ nip: identifier });
    } else if (auth.role === 'admin') {
      userData = await Admin.findOne({ nip: identifier });
    }

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'Data user tidak ditemukan'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userData._id,
        identifier: auth.nis,
        role: auth.role,
        nama: userData.nama
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Siapkan response data berdasarkan role
    const responseData = {
      user: {
        nama: userData.nama,
        role: auth.role
      },
      token
    };

    if (auth.role === 'siswa') {
      responseData.user.nis = userData.nis;
      responseData.user.kelas = userData.kelas;
    } else if (auth.role === 'guru') {
      responseData.user.nip = userData.nip;
      responseData.user.mataPelajaran = userData.mataPelajaran;
    } else if (auth.role === 'admin') {
      responseData.user.nip = userData.nip;
      responseData.user.email = userData.email;
    }

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: responseData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan login',
      error: error.message
    });
  }
};

// Register guru
export const registerGuru = async (req, res) => {
  try {
    const { nip, password, nama, jenisKelamin, tanggalLahir, alamat, noTelp, kelas, mataPelajaran, pendidikanTerakhir, email } = req.body;

    // Validasi input
    if (!nip || !password || !nama || !email || !kelas || !mataPelajaran) {
      return res.status(400).json({
        success: false,
        message: 'NIP, password, nama, email, kelas, dan mata pelajaran harus diisi'
      });
    }

    // Cek apakah kelas sudah memiliki wali kelas
    const existingWaliKelas = await Guru.findOne({ kelas });
    if (existingWaliKelas) {
      return res.status(400).json({
        success: false,
        message: `Kelas ${kelas} sudah memiliki wali kelas (${existingWaliKelas.nama})`
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

    // Cek apakah NIP atau email sudah terdaftar di Guru
    const existingGuru = await Guru.findOne({ 
      $or: [{ nip }, { email }] 
    });
    if (existingGuru) {
      return res.status(400).json({
        success: false,
        message: 'NIP atau email sudah terdaftar'
      });
    }

    // Buat akun auth dengan NIP sebagai username
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth = new Auth({
      nis: nip,
      password: hashedPassword,
      role: 'guru'  // Tetap pakai 'guru'
    });

    // Buat data walikelas
    const guru = new Guru({
      nip,
      nama,
      email,
      jenisKelamin,
      tanggalLahir,
      alamat,
      noTelp,
      kelas,
      mataPelajaran,
      pendidikanTerakhir
    });

    await auth.save();
    await guru.save();

    res.status(201).json({
      success: true,
      message: 'Registrasi wali kelas berhasil',
      data: {
        nip: guru.nip,
        nama: guru.nama,
        email: guru.email,
        kelas: guru.kelas,
        mataPelajaran: guru.mataPelajaran
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan registrasi guru',
      error: error.message
    });
  }
}; 