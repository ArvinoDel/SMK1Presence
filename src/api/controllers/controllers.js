import Siswa from '../models/Siswa.models.js';
import Absensi from '../models/Absensi.models.js';
import moment from 'moment-timezone';

// ... existing code ...

export const scanQRCode = async (req, res) => {
  try {
    const { qrData } = req.body;
    
    // Decode QR data
    const { nis, nisn } = JSON.parse(qrData);
    
    // Cari siswa berdasarkan NIS
    const siswa = await Siswa.findOne({ nis, nisn });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan'
      });
    }

    // Get current time in WIB
    const waktuAbsen = moment.tz('Asia/Jakarta').toDate();
    
    // Set tanggal untuk hari ini (reset jam ke 00:00:00)
    const tanggal = moment.tz('Asia/Jakarta').startOf('day').toDate();

    // Cek apakah sudah absen hari ini
    const absensiHariIni = await Absensi.findOne({
      siswa: siswa._id,
      tanggal
    });

    if (absensiHariIni) {
      return res.status(400).json({
        success: false,
        message: 'Siswa sudah melakukan absensi hari ini'
      });
    }

    // Set batas waktu (07:00 WIB)
    const batasWaktu = moment.tz('Asia/Jakarta')
      .startOf('day')
      .hour(7)
      .toDate();

    // Tentukan status absensi
    const status = waktuAbsen > batasWaktu ? 'TERLAMBAT' : 'HADIR';
    
    // Buat catatan absensi baru
    const absensi = new Absensi({
      siswa: siswa._id,
      tanggal,
      waktuAbsen,
      status,
      keterangan: status === 'TERLAMBAT' ? 
        `Terlambat ${Math.floor((waktuAbsen - batasWaktu) / (1000 * 60))} menit` : 
        'Tepat waktu'
    });

    await absensi.save();

    res.status(200).json({
      success: true,
      message: `Absensi berhasil dicatat sebagai ${status}`,
      data: {
        nama: siswa.nama,
        kelas: siswa.kelas,
        waktuAbsen: waktuAbsen.toLocaleTimeString('id-ID'),
        status,
        keterangan: absensi.keterangan
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses absensi',
      error: error.message
    });
  }
};

// Controller untuk mendapatkan laporan absensi
export const getLaporanAbsensi = async (req, res) => {
  try {
    const { tanggal, kelas } = req.query;
    
    const query = {};
    if (tanggal) {
      const dateQuery = new Date(tanggal);
      dateQuery.setHours(0, 0, 0, 0);
      query.tanggal = dateQuery;
    }

    const absensi = await Absensi.find(query)
      .populate({
        path: 'siswa',
        select: 'nis nama kelas',
        ...(kelas && { match: { kelas } })
      })
      .sort({ waktuAbsen: 'asc' });

    // Filter out null siswa (jika query kelas digunakan)
    const filteredAbsensi = absensi.filter(a => a.siswa !== null);

    res.status(200).json({
      success: true,
      data: filteredAbsensi
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil laporan absensi',
      error: error.message
    });
  }
};
