import Absensi from '../models/Absensi.models.js';
import Siswa from '../models/Siswa.models.js';
import KelasAbsensi from '../models/KelasAbsensi.models.js';

// Helper function untuk generate classCode
const generateClassCode = (kelas) => {
  // Format: [Jurusan][Tingkat]SMKN1
  // Contoh: RPL2SMKN1, TOI2SMKN1, etc.
  const jurusan = kelas.split(' ')[1]; // Ambil RPL dari "XII RPL 2"
  const tingkat = kelas.split(' ')[2]; // Ambil 2 dari "XII RPL 2"
  return `${jurusan}${tingkat}SMKN1`;
};

// Fungsi untuk mengupdate summary ketika ada perubahan absensi
export const updateKelasAbsensiOnChange = async (absensi) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Dapatkan data siswa yang absensinya diupdate
    const siswa = await Siswa.findById(absensi.siswa);
    if (!siswa) return;

    const classCode = generateClassCode(siswa.kelas);

    // Dapatkan semua siswa di kelas yang sama
    const siswaKelas = await Siswa.find({ kelas: siswa.kelas });
    const siswaIds = siswaKelas.map(s => s._id);

    // Dapatkan semua record absensi untuk kelas tersebut hari ini
    const absensiRecords = await Absensi.find({
      siswa: { $in: siswaIds },
      tanggal: today
    }).populate('siswa', 'nama kelas');

    // Hitung ulang summary
    const summary = {
      total: siswaKelas.length,
      hadir: 0,
      terlambat: 0,
      sakit: 0,
      izin: 0,
      alfa: 0
    };

    const detailSiswa = [];
    for (const siswaSingle of siswaKelas) {
      const absensiRecord = absensiRecords.find(a => 
        a.siswa._id.equals(siswaSingle._id)
      );
      
      if (absensiRecord) {
        summary[absensiRecord.status.toLowerCase()]++;
        detailSiswa.push({
          siswa: siswaSingle._id,
          status: absensiRecord.status,
          jamMasuk: absensiRecord.jamMasuk,
          keterangan: absensiRecord.keterangan
        });
      } else {
        summary.alfa++;
        detailSiswa.push({
          siswa: siswaSingle._id,
          status: 'ALFA',
          keterangan: 'Tidak hadir tanpa keterangan'
        });
      }
    }

    // Update summary di database
    await KelasAbsensi.findOneAndUpdate(
      { 
        tanggal: today, 
        kelas: siswa.kelas,
        classCode
      },
      {
        summary,
        detailSiswa,
        classCode
      },
      { upsert: true, new: true }
    );

    console.log('Kelas attendance summary updated successfully');
  } catch (error) {
    console.error('Error updating kelas attendance summary:', error);
  }
};

export const generateKelasAbsensi = async () => {
  try {
    // Get today's date with time set to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all unique classes
    const allKelas = await Siswa.distinct('kelas');

    // Process each class
    for (const kelas of allKelas) {
      const classCode = generateClassCode(kelas);
      // Get all students in this class
      const siswaKelas = await Siswa.find({ kelas });
      const siswaIds = siswaKelas.map(s => s._id);

      // Get attendance records for today
      const absensiRecords = await Absensi.find({
        siswa: { $in: siswaIds },
        tanggal: today
      }).populate('siswa', 'nama kelas');

      // Initialize counters
      const summary = {
        total: siswaKelas.length,
        hadir: 0,
        terlambat: 0,
        sakit: 0,
        izin: 0,
        alfa: 0
      };

      // Process attendance records
      const detailSiswa = [];
      for (const siswa of siswaKelas) {
        const absensi = absensiRecords.find(a => a.siswa._id.equals(siswa._id));
        
        if (absensi) {
          summary[absensi.status.toLowerCase()]++;
          detailSiswa.push({
            siswa: siswa._id,
            status: absensi.status,
            jamMasuk: absensi.jamMasuk,
            keterangan: absensi.keterangan
          });
        } else {
          summary.alfa++;
          detailSiswa.push({
            siswa: siswa._id,
            status: 'ALFA',
            keterangan: 'Tidak hadir tanpa keterangan'
          });
        }
      }

      // Save or update the summary
      await KelasAbsensi.findOneAndUpdate(
        { 
          tanggal: today, 
          kelas,
          classCode
        },
        {
          summary,
          detailSiswa,
          classCode
        },
        { upsert: true, new: true }
      );
    }

    console.log('Kelas attendance summary generated successfully');
  } catch (error) {
    console.error('Error generating kelas attendance summary:', error);
  }
};

// Get today's summary
export const getKelasAbsensi = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const summaries = await KelasAbsensi.find({ tanggal: today })
      .populate('detailSiswa.siswa', 'nama nis kelas')
      .sort({ kelas: 1 });

    res.status(200).json({
      success: true,
      data: summaries.map(summary => ({
        ...summary.toObject(),
        classCode: summary.classCode
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data summary absensi',
      error: error.message
    });
  }
};

// Get summary by specific date
export const getKelasAbsensiByDate = async (req, res) => {
  try {
    const { tanggal } = req.query;
    const date = new Date(tanggal);
    date.setHours(0, 0, 0, 0);

    const summaries = await KelasAbsensi.find({ tanggal: date })
      .populate('detailSiswa.siswa', 'nama nis kelas')
      .sort({ kelas: 1 });

    res.status(200).json({
      success: true,
      data: summaries.map(summary => ({
        ...summary.toObject(),
        classCode: summary.classCode
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data summary absensi',
      error: error.message
    });
  }
}; 