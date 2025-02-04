import Siswa from '../models/Siswa.models.js';
import Absensi from '../models/Absensi.models.js';

export const prosesAbsensi = async (req, res) => {
  try {
    // Data dari scan gun (sekarang hanya berisi nis)
    const { nis } = JSON.parse(req.body.qrData);

    // Cari siswa berdasarkan NIS saja
    const siswa = await Siswa.findOne({ nis });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Set waktu sekarang (WIB/UTC+7)
    const sekarang = new Date();
    const jamMasuk = new Date(sekarang.getTime() + (7 * 60 * 60 * 1000));
    
    // Set tanggal hari ini (reset jam ke 00:00:00)
    const tanggal = new Date(jamMasuk);
    tanggal.setHours(0, 0, 0, 0);

    // Cek apakah sudah absen hari ini
    const sudahAbsen = await Absensi.findOne({
      siswa: siswa._id,
      tanggal: tanggal
    });

    if (sudahAbsen) {
      return res.status(400).json({
        success: false,
        message: 'Siswa sudah melakukan absensi hari ini',
        data: {
          nama: siswa.nama,
          kelas: siswa.kelas,
          waktuAbsen: sudahAbsen.jamMasuk
        }
      });
    }

    // Set batas waktu (07:00 WIB)
    const batasWaktu = new Date(tanggal);
    batasWaktu.setHours(7, 0, 0, 0);

    // Tentukan status
    const status = jamMasuk > batasWaktu ? 'TERLAMBAT' : 'HADIR';

    // Buat record absensi baru
    const absensi = new Absensi({
      siswa: siswa._id,
      tanggal: tanggal,
      jamMasuk: jamMasuk,
      status: status
    });

    await absensi.save();

    // Format waktu ke format yang lebih readable
    const waktuAbsen = jamMasuk.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    res.status(200).json({
      success: true,
      message: `Absensi berhasil dicatat`,
      data: {
        nama: siswa.nama,
        kelas: siswa.kelas,
        waktuAbsen: waktuAbsen,
        status: status,
        keterangan: status === 'TERLAMBAT' ? 
          `Terlambat ${Math.floor((jamMasuk - batasWaktu) / (1000 * 60))} menit` : 
          'Tepat waktu'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memproses absensi',
      error: error.message
    });
  }
}; 