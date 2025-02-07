import Siswa from '../models/Siswa.models.js';

// Get profile data
export const getProfile = async (req, res) => {
  try {
    const { nis } = req.user;

    const siswa = await Siswa.findOne({ nis });
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        nis: siswa.nis,
        nisn: siswa.nisn,
        nama: siswa.nama,
        kelas: siswa.kelas,
        jenisKelamin: siswa.jenisKelamin,
        tanggalLahir: siswa.tanggalLahir,
        alamat: siswa.alamat,
        noTelp: siswa.noTelp
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data profile',
      error: error.message
    });
  }
};

// Update profile data
export const updateProfile = async (req, res) => {
  try {
    const { nis } = req.user;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.nis;
    delete updateData.nisn;

    const siswa = await Siswa.findOneAndUpdate(
      { nis },
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: 'Data siswa tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: {
        nis: siswa.nis,
        nisn: siswa.nisn,
        nama: siswa.nama,
        kelas: siswa.kelas,
        jenisKelamin: siswa.jenisKelamin,
        tanggalLahir: siswa.tanggalLahir,
        alamat: siswa.alamat,
        noTelp: siswa.noTelp
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate profile',
      error: error.message
    });
  }
}; 