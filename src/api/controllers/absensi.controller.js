import Siswa from '../models/Siswa.models.js';
import Absensi from '../models/Absensi.models.js';
import cloudinary from '../config/cloudinary.js';

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
    const { nisn, status, keterangan } = req.body;
    const suratIzin = req.file; // Opsional

    // Validasi status
    if (!['SAKIT', 'IZIN'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status harus SAKIT atau IZIN'
      });
    }

    // Validasi keterangan
    if (!keterangan) {
      return res.status(400).json({
        success: false,
        message: 'Keterangan harus diisi'
      });
    }

    // Cari siswa
    const siswa = await Siswa.findOne({ nisn });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Set tanggal hari ini
    const jamMasuk = new Date();
    const tanggal = new Date(jamMasuk);
    tanggal.setHours(0, 0, 0, 0);

    // Persiapkan data absensi
    const absensiData = {
      siswa: siswa._id,
      tanggal,
      jamMasuk,
      status,
      keterangan
    };

    // Jika ada surat, upload ke Cloudinary
    if (suratIzin) {
      const result = await cloudinary.uploader.upload(suratIzin.path, {
        folder: 'surat-izin'
      });
      absensiData.suratIzin = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    // Buat record absensi
    const absensi = new Absensi(absensiData);
    await absensi.save();

    // Siapkan response data
    const responseData = {
      nama: siswa.nama,
      kelas: siswa.kelas,
      status,
      keterangan
    };

    // Tambahkan URL surat jika ada
    if (suratIzin) {
      responseData.suratIzin = absensiData.suratIzin.url;
    }

    res.status(200).json({
      success: true,
      message: 'Izin berhasil diproses',
      data: responseData
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
    const { nis } = req.user;

    // Cari data absensi berdasarkan nis
    const absensi = await Absensi.findOne({ nis }).populate('siswa', 'nama nis photo'); // Pastikan ada hubungan dengan model siswa

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
    const { nisn } = req.params;
    const { tanggalMulai, tanggalAkhir } = req.query;

    // Cari siswa
    const siswa = await Siswa.findOne({ nisn });
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
    const { nis } = req.user; // Ambil dari token yang sudah di-decode

    // Cari siswa
    const siswa = await Siswa.findOne({ nis });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    // Ambil riwayat absensi
    const riwayat = await Absensi.find({ siswa: siswa._id })
      .sort({ tanggal: -1, jamMasuk: -1 })
      .populate('siswa', 'nama kelas photo');

    // Format response dengan format tanggal Indonesia
    const formattedRiwayat = riwayat.map(absen => ({
      id: absen._id,
      nama: absen.siswa.nama,
      kelas: absen.siswa.kelas,
      photo: absen.siswa.photo,
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