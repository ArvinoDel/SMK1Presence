import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import Siswa from '../models/Siswa.models.js';

export const generateBarcode = async (req, res) => {
  try {
    const { nisn } = req.user;

    const siswa = await Siswa.findOne({ nisn });
    
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Create canvas for barcode
    const canvas = createCanvas(300, 100);
    
    // Generate barcode
    JsBarcode(canvas, siswa.nisn, {
      format: "CODE128",
      width: 2,
      height: 100,
      displayValue: false
    });

    // Convert to base64
    const barcode = canvas.toDataURL();

    // Update barcode in database
    siswa.barcode = barcode;
    await siswa.save();

    res.status(200).json({
      success: true,
      message: 'Barcode berhasil digenerate',
      data: {
        nama: siswa.nama,
        kelas: siswa.kelas,
        barcode: barcode
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal generate Barcode',
      error: error.message
    });
  }
};

export const getMyBarcode = async (req, res) => {
  try {
    const { nisn } = req.user;

    const siswa = await Siswa.findOne({ nisn });
    
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    if (!siswa.barcode) {
      return res.status(404).json({
        success: false,
        message: 'Barcode belum digenerate'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        nama: siswa.nama,
        kelas: siswa.kelas,
        barcode: siswa.barcode
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil Barcode',
      error: error.message
    });
  }
}; 