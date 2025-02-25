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
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'nomor induk dan password harus diisi!'
      });
    }

    // Cari di Auth terlebih dahulu karena password ada di sini
    const auth = await Auth.findOne({ nis: identifier }).select('+password');

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

    // Setelah password valid, cari data lengkap user
    const [guru, siswa] = await Promise.all([
      Guru.findOne({ nip: identifier }),
      Siswa.findOne({ nis: identifier })
    ]);

    // Tentukan user dan role
    let user = guru || siswa;
    let role = guru ? 'guru' : 'siswa';

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Data user tidak ditemukan'
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        identifier: role === 'guru' ? user.nip : user.nis,
        role,
        nama: user.nama
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Siapkan response data berdasarkan role
    const userData = {
      nama: user.nama,
      role,
      ...(role === 'siswa' ? {
        nis: user.nis,
        nisn: user.nisn,
        kelas: user.kelas
      } : {
        nip: user.nip,
        mataPelajaran: user.mataPelajaran
      })
    };

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: userData
      }
    });

  } catch (error) {
    console.error('Login error:', error);
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