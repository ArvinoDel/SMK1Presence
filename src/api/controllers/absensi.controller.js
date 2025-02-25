import Siswa from '../models/Siswa.models.js';
import Absensi from '../models/Absensi.models.js';
import cloudinary from '../config/cloudinary.js';
import { updateKelasAbsensiOnChange } from './kelasAbsensi.controller.js';

export const prosesAbsensi = async (req, res) => {
  try {
    // Data dari WSR-2200 scanner (berisi NISN dengan prefix ]C0)
    let { nisn } = req.body;

    // Bersihkan prefix ]C0 dari scanner WSR-2200
    nisn = nisn.replace(/^\]C0/, '').trim();

    console.log('NISN after cleaning:', nisn); // Untuk debugging

    // Cari siswa berdasarkan NISN
    const siswa = await Siswa.findOne({ nisn });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Gunakan waktu scan langsung tanpa offset timezone
    const jamMasuk = new Date();

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
          waktuAbsen: sudahAbsen.jamMasuk.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
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

    // Update summary kelas
    await updateKelasAbsensiOnChange(absensi);

    res.status(200).json({
      success: true,
      message: `Absensi berhasil dicatat`,
      data: {
        nama: siswa.nama,
        kelas: siswa.kelas,
        waktuAbsen: jamMasuk.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
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

export const prosesIzin = async (req, res) => {
  try {
    const { nisn } = req.body;
    const { status, keterangan } = req.body;
    const suratIzin = req.file;

    // Cari siswa berdasarkan NISN
    const siswa = await Siswa.findOne({ nisn });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Validasi status
    if (!['SAKIT', 'IZIN'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status harus SAKIT atau IZIN'
      });
    }

    // Set tanggal hari ini
    const jamMasuk = new Date();
    const tanggal = new Date(jamMasuk);
    tanggal.setHours(0, 0, 0, 0);

    // Cek apakah sudah ada absensi hari ini
    const absensiExists = await Absensi.findOne({
      siswa: siswa._id,
      tanggal: tanggal
    });

    if (absensiExists) {
      return res.status(400).json({
        success: false,
        message: 'Sudah ada absensi untuk hari ini'
      });
    }

    // Persiapkan data absensi
    const absensiData = {
      siswa: siswa._id,
      tanggal,
      jamMasuk,
      status,
      keterangan
    };

    // Jika ada surat izin, simpan path-nya
    if (suratIzin) {
      absensiData.suratIzin = {
        url: `/uploads/surat/${suratIzin.filename}`,
        publicId: suratIzin.filename
      };
    }

    // Buat record absensi
    const absensi = new Absensi(absensiData);
    await absensi.save();

    // Update summary kelas
    await updateKelasAbsensiOnChange(absensi);

    res.status(200).json({
      success: true,
      message: 'Izin berhasil diproses',
      data: {
        nama: siswa.nama,
        kelas: siswa.kelas,
        status,
        keterangan,
        suratIzin: absensiData.suratIzin?.url
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memproses izin',
      error: error.message
    });
  }
};

export const getMyAbsensi = async (req, res) => {
  try {
    const { identifier, role } = req.user;

    // Sesuaikan query berdasarkan role
    const query = role === 'guru' ? { nip: identifier } : { nis: identifier };
    
    const absensi = await Absensi.findOne(query).populate('siswa', 'nama nis photo');

    if (!absensi) {
      return res.status(404).json({
        success: false,
        message: 'Data absensi tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        siswa: absensi.siswa ? absensi.siswa.nama : "Tidak ditemukan",
        tanggal: absensi.tanggal,
        jamMasuk: absensi.jamMasuk,
        status: absensi.status,
        keterangan: absensi.keterangan,
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data absensi',
      error: error.message
    });
  }
};

export const getRiwayatAbsensi = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { tanggalMulai, tanggalAkhir } = req.query;

    // Cari siswa
    const siswa = await Siswa.findOne({ nis: identifier });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Buat query untuk rentang tanggal
    const query = {
      siswa: siswa._id
    };

    if (tanggalMulai && tanggalAkhir) {
      query.tanggal = {
        $gte: new Date(tanggalMulai),
        $lte: new Date(tanggalAkhir)
      };
    }

    // Ambil riwayat absensi
    const riwayat = await Absensi.find(query)
      .sort({ tanggal: -1, jamMasuk: -1 });

    // Format response dengan format tanggal Indonesia
    const formattedRiwayat = riwayat.map(absen => ({
      _id: absen._id,
      siswa: absen.siswa,
      tanggal: new Date(absen.tanggal).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      jamMasuk: new Date(absen.jamMasuk).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: absen.status,
      keterangan: absen.keterangan,
      suratIzin: absen.suratIzin?.url || null
    }));

    res.status(200).json({
      success: true,
      data: {
        siswa: {
          nama: siswa.nama,
          kelas: siswa.kelas
        },
        riwayat: formattedRiwayat
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat absensi',
      error: error.message
    });
  }
};

export const getRiwayatAbsensiByNIS = async (req, res) => {
  try {
    const { identifier } = req.user;

    const siswa = await Siswa.findOne({ nis: identifier });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    const riwayat = await Absensi.find({ siswa: siswa._id })
      .sort({ tanggal: -1, jamMasuk: -1 })
      .populate('siswa', 'nama kelas photo');

    // Format response dengan format tanggal Indonesia
    const formattedRiwayat = riwayat.map(absen => {
      // Get base URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      return {
        id: absen._id,
        nama: absen.siswa.nama,
        kelas: absen.siswa.kelas,
        photo: absen.siswa.photo ? `${baseUrl}${absen.siswa.photo}` : null,
        tanggal: new Date(absen.tanggal).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        jamMasuk: new Date(absen.jamMasuk).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: absen.status,
        keterangan: absen.keterangan,
        suratIzin: absen.suratIzin?.url || null
      };
    });

    res.status(200).json({
      success: true,
      data: formattedRiwayat
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat absensi',
      error: error.message
    });
  }
};

export const createOrUpdateAbsensi = async (req, res) => {
  try {
    // ... existing code untuk create/update absensi ...
    // Setelah absensi berhasil dibuat/diupdate
    const absensi = await Absensi.create(req.body);
    
    // Update summary kelas
    await updateKelasAbsensiOnChange(absensi);

    res.status(200).json({
      success: true,
      message: 'Absensi berhasil dicatat',
      data: absensi
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mencatat absensi',
      error: error.message
    });
  }
}; 