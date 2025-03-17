import Siswa from '../models/Siswa.models.js';
import Absensi from '../models/Absensi.models.js';
import cloudinary from '../config/cloudinary.js';
import { updateKelasAbsensiOnChange } from './kelasAbsensi.controller.js';
import Guru from '../models/Guru.models.js';
import ExcelJS from 'exceljs';

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

export const scanQRCode = async (req, res) => {
  try {
    const { qrData } = req.body;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Find student by NISN
    const siswa = await Siswa.findOne({ nisn: qrData });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan'
      });
    }

    // Get current time
    const now = new Date();
    
    // Set date for today (reset time to 00:00:00)
    const tanggal = new Date(now);
    tanggal.setHours(0, 0, 0, 0);

    // Check if already attended today
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

    // Create new attendance record
    const absensi = new Absensi({
      siswa: siswa._id,
      tanggal,
      jamMasuk: now,
      status: 'HADIR',
      keterangan: 'Absensi via QR Code'
    });

    await absensi.save();

    // Update kelas summary
    await updateKelasAbsensiOnChange(absensi);

    res.status(200).json({
      success: true,
      message: 'Absensi berhasil dicatat',
      data: {
        nama: siswa.nama,
        photo: siswa.photo ? `${baseUrl}${siswa.photo}` : null,
        kelas: siswa.kelas,
        status: 'HADIR',
        keterangan: 'Absensi via QR Code'
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

export const getKelasAbsensi = async (req, res) => {
  try {
    const { kodeKelas } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get current time in WIB (UTC+7)
    const now = new Date();
    const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const wibHour = wibTime.getHours();

    // Get all students in the class
    const siswaKelas = await Siswa.find({ 
      kelas: { $regex: new RegExp(kodeKelas, 'i') }
    });

    if (siswaKelas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada siswa ditemukan untuk kelas ini'
      });
    }

    // Get today's attendance for these students
    const absensiHariIni = await Absensi.find({
      siswa: { $in: siswaKelas.map(s => s._id) },
      tanggal: today
    });

    // If it's 8 AM or later, automatically create ALFA records
    if (wibHour >= 8) {
      for (const siswa of siswaKelas) {
        const hasAttendance = absensiHariIni.some(a => 
          a.siswa.toString() === siswa._id.toString()
        );

        if (!hasAttendance) {
          try {
            // Check if ALFA record already exists
            const existingAlfa = await Absensi.findOne({
              siswa: siswa._id,
              tanggal: today,
              status: 'ALFA'
            });

            if (!existingAlfa) {
              const alfaRecord = new Absensi({
                siswa: siswa._id,
                tanggal: today,
                jamMasuk: now,
                status: 'ALFA',
                keterangan: 'Tidak hadir tanpa keterangan'
              });
              
              const savedRecord = await alfaRecord.save();
              absensiHariIni.push(savedRecord);
              console.log(`Created ALFA record for student ${siswa.nama}`);
            }
          } catch (error) {
            if (error.code === 11000) {
              console.log(`ALFA record already exists for student ${siswa.nama}`);
            } else {
              console.error(`Error creating ALFA record for student ${siswa.nama}:`, error);
            }
          }
        }
      }
    }

    // Combine student data with attendance
    const data = siswaKelas.map(siswa => {
      const absensi = absensiHariIni.find(a => 
        a.siswa.toString() === siswa._id.toString()
      );

      return {
        nis: siswa.nis,
        nisn: siswa.nisn,
        nama: siswa.nama,
        kelas: siswa.kelas,
        status: absensi ? absensi.status : (wibHour >= 8 ? 'ALFA' : '-')
      };
    });

    res.status(200).json({
      success: true,
      data,
      summary: {
        total: siswaKelas.length,
        hadir: data.filter(s => s.status === 'HADIR').length,
        alfa: data.filter(s => s.status === 'ALFA').length,
        izin: data.filter(s => s.status === 'IZIN').length,
        sakit: data.filter(s => s.status === 'SAKIT').length,
        timestamp: wibTime.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
      }
    });

  } catch (error) {
    console.error('Error in getKelasAbsensi:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data absensi kelas',
      error: error.message
    });
  }
};

export const getRiwayatAbsensiByWaliKelas = async (req, res) => {
  try {
    const { identifier } = req.user; // NIP guru dari token

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    
    // Cari data guru dan kelas yang diwalikan
    const guru = await Guru.findOne({ nip: identifier })
      .select('nip nama kelas');

    if (!guru || !guru.kelas) {
      return res.status(404).json({
        success: false,
        message: 'Guru tidak ditemukan atau bukan wali kelas'
      });
    }

    // Ambil semua siswa di kelas tersebut
    const siswaList = await Siswa.find({ kelas: guru.kelas })
      .select('nis nisn nama kelas')
      .sort({ nama: 1 });

    // Ambil riwayat absensi untuk semua siswa
    const riwayatAbsensi = await Absensi.find({
      siswa: { $in: siswaList.map(s => s._id) }
    })
    .sort({ tanggal: -1, jamMasuk: -1 })
    .populate('siswa', 'nis nisn nama kelas photo');

    // Kelompokkan data berdasarkan tanggal
    const groupedData = {};

    riwayatAbsensi.forEach(absen => {
      const tanggal = new Date(absen.tanggal).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!groupedData[tanggal]) {
        groupedData[tanggal] = [];
      }

      groupedData[tanggal].push({
        id: absen._id,
        nis: absen.siswa.nis,
        nisn: absen.siswa.nisn,
        nama: absen.siswa.nama,
        photo: absen.siswa.photo ? `${baseUrl}${absen.siswa.photo}` : null,
        jamMasuk: new Date(absen.jamMasuk).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: absen.status,
        keterangan: absen.keterangan,
        suratIzin: absen.suratIzin?.url || null
      });
    });

    // Convert groupedData object to array format
    const formattedData = Object.entries(groupedData).map(([tanggal, absensi]) => ({
      tanggal,
      data: absensi
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat absensi',
      error: error.message
    });
  }
};

export const downloadRekapanSemester = async (req, res) => {
  try {
    // Cek role dari token
    const { role } = req.user;
    if (role !== 'guru') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya guru yang dapat mengunduh rekapan.'
      });
    }

    const { kelas, semester, tahun } = req.query;
    if (!kelas || !semester || !tahun) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({
        success: false,
        message: 'Kelas, semester, dan tahun harus diisi'
      });
    }

    // Tentukan range tanggal semester (6 bulan)
    let startDate, endDate;
    if (semester === '1') {
      startDate = new Date(tahun, 6, 1); // Juli
      endDate = new Date(tahun, 11, 31); // Desember
    } else {
      startDate = new Date(tahun, 0, 1); // Januari
      endDate = new Date(tahun, 5, 30); // Juni
    }

    // Ambil semua siswa dalam kelas tersebut
    const siswaList = await Siswa.find({ kelas }).sort({ nama: 1 });

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rekapan Absensi');

    // Styling untuk header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(4).font = { bold: true };

    // Tambahkan header
    worksheet.mergeCells('A1:H1');
    worksheet.getCell('A1').value = `REKAPITULASI ABSENSI SEMESTER ${semester} TAHUN ${tahun}`;
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2:H2');
    worksheet.getCell('A2').value = `Kelas: ${kelas}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A3:H3');
    worksheet.getCell('A3').value = `Periode: ${startDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} - ${endDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
    worksheet.getCell('A3').alignment = { horizontal: 'center' };

    // Header tabel
    worksheet.getRow(4).values = ['No', 'NIS', 'NISN', 'Nama Siswa', 'Hadir', 'Sakit', 'Izin', 'Alfa'];

    // Set lebar kolom
    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 12;
    worksheet.getColumn('C').width = 12;
    worksheet.getColumn('D').width = 30;
    worksheet.getColumn('E').width = 10;
    worksheet.getColumn('F').width = 10;
    worksheet.getColumn('G').width = 10;
    worksheet.getColumn('H').width = 10;

    // Isi data siswa
    let rowNumber = 5;
    for (const [index, siswa] of siswaList.entries()) {
      const absensiList = await Absensi.find({
        siswa: siswa._id,
        tanggal: {
          $gte: startDate,
          $lte: endDate
        }
      });

      const summary = {
        HADIR: 0,
        SAKIT: 0,
        IZIN: 0,
        ALFA: 0
      };

      absensiList.forEach(absen => {
        // Jika status TERLAMBAT, hitung sebagai HADIR
        if (absen.status === 'TERLAMBAT') {
          summary.HADIR++;
        } else {
          summary[absen.status]++;
        }
      });

      worksheet.getRow(rowNumber).values = [
        index + 1,
        siswa.nis,
        siswa.nisn,
        siswa.nama,
        summary.HADIR,
        summary.SAKIT,
        summary.IZIN,
        summary.ALFA
      ];

      rowNumber++;
    }

    // Set response headers untuk file Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=rekapan_${kelas}_semester${semester}_${tahun}.xlsx`);

    // Kirim workbook ke response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({
      success: false,
      message: 'Gagal mengunduh rekapan semester',
      error: error.message
    });
  }
};

export const processAlfa = async (req, res) => {
  try {
    const { kodeKelas } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all students in the class
    const siswaKelas = await Siswa.find({ 
      kelas: { $regex: new RegExp(kodeKelas, 'i') }
    });

    if (siswaKelas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada siswa ditemukan untuk kelas ini'
      });
    }

    // Get today's attendance for these students
    const absensiHariIni = await Absensi.find({
      siswa: { $in: siswaKelas.map(s => s._id) },
      tanggal: today
    });

    // Process ALFA records
    const alfaRecords = [];
    const errors = [];
    
    for (const siswa of siswaKelas) {
      const hasAttendance = absensiHariIni.some(a => 
        a.siswa.toString() === siswa._id.toString()
      );

      if (!hasAttendance) {
        try {
          // Check if ALFA record already exists
          const existingAlfa = await Absensi.findOne({
            siswa: siswa._id,
            tanggal: today,
            status: 'ALFA'
          });

          if (!existingAlfa) {
            const alfaRecord = new Absensi({
              siswa: siswa._id,
              tanggal: today,
              jamMasuk: new Date(),
              status: 'ALFA',
              keterangan: 'Tidak hadir tanpa keterangan'
            });
            
            const savedRecord = await alfaRecord.save();
            alfaRecords.push({
              nama: siswa.nama,
              nis: siswa.nis,
              status: 'ALFA'
            });
          }
        } catch (error) {
          errors.push({
            siswa: siswa.nama,
            error: error.message
          });
        }
      }
    }

    // Update kelas summary after processing ALFA
    await updateKelasAbsensiOnChange(alfaRecords[0]);

    res.status(200).json({
      success: true,
      message: `Berhasil memproses ${alfaRecords.length} record ALFA`,
      data: {
        processed: alfaRecords,
        errors: errors,
        timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
      }
    });

  } catch (error) {
    console.error('Error processing ALFA:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memproses ALFA',
      error: error.message
    });
  }
};

export const getAbsensiPerKelas = async (req, res) => {
  try {
    // Get all unique classes
    const allKelas = await Siswa.distinct('kelas');
    const result = [];

    // Process each class
    for (const kelas of allKelas) {
      // Get all students in this class
      const siswaKelas = await Siswa.find({ kelas });
      const siswaIds = siswaKelas.map(s => s._id);

      // Get all attendance records for these students
      const absensiRecords = await Absensi.find({
        siswa: { $in: siswaIds }
      }).populate('siswa', 'nama nis kelas photo');

      // Calculate summary
      const summary = {
        total: siswaKelas.length,
        hadir: 0,
        sakit: 0,
        izin: 0,
        alfa: 0
      };

      // Group attendance records by student
      const detailSiswa = [];
      
      // Process each attendance record
      absensiRecords.forEach(record => {
        // Update summary based on status
        if (record.status === 'HADIR') summary.hadir++;
        else if (record.status === 'SAKIT') summary.sakit++;
        else if (record.status === 'IZIN') summary.izin++;
        else if (record.status === 'ALFA') summary.alfa++;

        // Add to details with complete information
        detailSiswa.push({
          siswa: {
            nama: record.siswa.nama,
            nis: record.siswa.nis,
            kelas: record.siswa.kelas,
            photo: record.siswa.photo
          },
          status: record.status,
          tanggal: record.tanggal,
          jamMasuk: record.jamMasuk,
          keterangan: record.keterangan
        });
      });

      // Sort detail by date (newest first) and then by student name
      detailSiswa.sort((a, b) => {
        if (a.tanggal === b.tanggal) {
          return a.siswa.nama.localeCompare(b.siswa.nama);
        }
        return new Date(b.tanggal) - new Date(a.tanggal);
      });

      // Add class data to result
      result.push({
        kelas,
        classCode: kelas.replace(/\s+/g, ''),
        summary,
        detailSiswa
      });
    }

    // Sort classes
    result.sort((a, b) => a.kelas.localeCompare(b.kelas));

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in getAbsensiPerKelas:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data absensi per kelas',
      error: error.message
    });
  }
}; 