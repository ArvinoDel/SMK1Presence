import Siswa from '../models/Siswa.models.js';
import Absensi from '../models/Absensi.models.js';

export const prosesAbsensi = async (req, res) => {
  try {
    // Data dari WSR-2200 scanner (berisi NISN dengan prefix dan suffix)
    let { nisn } = req.body;
    
    // Bersihkan prefix dan suffix dari scanner WSR-2200
    nisn = nisn.replace(/[\]C\r]/g, '').trim();
    
    // Cari siswa berdasarkan NISN
    const siswa = await Siswa.findOne({ nisn });
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
      status: status,
      keterangan: status === 'TERLAMBAT' ? 
        `Terlambat ${Math.floor((jamMasuk - batasWaktu) / (1000 * 60))} menit` : 
        'Tepat waktu'
    });

    await absensi.save();

    res.status(200).json({
      success: true,
      message: `Absensi berhasil dicatat`,
      data: {
        nama: siswa.nama,
        kelas: siswa.kelas,
        waktuAbsen: jamMasuk.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: status,
        keterangan: absensi.keterangan
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