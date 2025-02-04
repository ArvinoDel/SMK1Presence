import QRCode from 'qrcode';
import Siswa from '../models/Siswa.models.js';

export const generateQRCode = async (req, res) => {
  try {
    // Ambil NISN dari user yang sedang login
    const { nisn } = req.user; // Asumsi data user tersedia dari middleware auth

    // Cari data siswa dari database
    const siswa = await Siswa.findOne({ nisn });
    
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Generate QR code yang hanya berisi NISN
    const qrData = JSON.stringify({ nisn });
    
    const qrCode = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300
    });

    // Update QR code di database
    siswa.qrCode = qrCode;
    await siswa.save();

    res.status(200).json({
      success: true,
      message: 'QR Code berhasil digenerate',
      data: {
        nama: siswa.nama,
        kelas: siswa.kelas,
        qrCode: qrCode
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal generate QR Code',
      error: error.message
    });
  }
};

// Mendapatkan QR code yang sudah di-generate sebelumnya
export const getMyQRCode = async (req, res) => {
  try {
    const { nisn } = req.user; // Ambil dari user yang login

    const siswa = await Siswa.findOne({ nisn });
    
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    if (!siswa.qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code belum digenerate'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        nama: siswa.nama,
        kelas: siswa.kelas,
        qrCode: siswa.qrCode
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil QR Code',
      error: error.message
    });
  }
}; 