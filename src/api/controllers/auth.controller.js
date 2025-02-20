import Auth from '../models/Auth.models.js';
import Siswa from '../models/Siswa.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Guru from '../models/Guru.models.js';

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
    const { identifier, password } = req.body;  // identifier bisa NIS atau NIP

    // Validasi input
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'ID dan password harus diisi'
      });
    }

    // Cari di Auth berdasarkan identifier (nis atau nip)
    const auth = await Auth.findOne({ nis: identifier });
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: 'ID atau password salah'
      });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, auth.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'ID atau password salah'
      });
    }

    let userData;
    // Cek role untuk menentukan model yang digunakan
    if (auth.role === 'guru') {
      userData = await Guru.findOne({ nip: identifier });
    } else if (auth.role === 'siswa') {
      userData = await Siswa.findOne({ nis: identifier });
    }

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'Data pengguna tidak ditemukan'
      });
    }

    // Generate token dengan data yang sesuai
    const token = jwt.sign(
      {
        id: userData._id,
        identifier: identifier, // bisa nis atau nip
        role: auth.role,
        nama: userData.nama
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
          nama: userData.nama,
          role: auth.role,
          ...(auth.role === 'siswa' ? {
            nis: userData.nis,
            nisn: userData.nisn,
            kelas: userData.kelas
          } : {
            nip: userData.nip,
            mataPelajaran: userData.mataPelajaran
          })
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

// Register guru
export const registerGuru = async (req, res) => {
  try {
    const { nip, password, nama, jenisKelamin, tanggalLahir, alamat, noTelp, mataPelajaran, pendidikanTerakhir } = req.body;

    // Validasi input
    if (!nip || !password || !nama) {
      return res.status(400).json({
        success: false,
        message: 'NIP, password, dan nama harus diisi'
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

    // Cek apakah NIP sudah terdaftar di Guru
    const existingGuru = await Guru.findOne({ nip });
    if (existingGuru) {
      return res.status(400).json({
        success: false,
        message: 'NIP sudah terdaftar'
      });
    }

    // Buat akun auth dengan NIP sebagai username
    const auth = new Auth({
      nis: nip, // menggunakan field nis untuk menyimpan nip
      password,
      role: 'guru' // tambahkan role guru
    });

    // Buat data guru
    const guru = new Guru({
      nip,
      nama,
      jenisKelamin,
      tanggalLahir,
      alamat,
      noTelp,
      mataPelajaran,
      pendidikanTerakhir
    });

    await auth.save();
    await guru.save();

    res.status(201).json({
      success: true,
      message: 'Registrasi guru berhasil',
      data: {
        nip: guru.nip,
        nama: guru.nama,
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