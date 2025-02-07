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
        barcode: siswa.barcode,
        firstName: siswa.firstName,
        lastName: siswa.lastName,
        email: siswa.email,
        alamat: {
          street: siswa.alamat?.street,
          city: siswa.alamat?.city,
          state: siswa.alamat?.state,
          postalCode: siswa.alamat?.postalCode
        },
        photo: siswa.photo,
        coverPhoto: siswa.coverPhoto
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
    const {
      firstName,
      lastName,
      email,
      jenisKelamin,
      street,
      city,
      state,
      postalCode,
      photo,
      coverPhoto
    } = req.body;

    // Fields that can be updated
    const updateData = {
      firstName,
      lastName,
      email,
      jenisKelamin,
      alamat: {
        street,
        city,
        state,
        postalCode
      },
      photo,
      coverPhoto,
      updatedAt: new Date()
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const siswa = await Siswa.findOneAndUpdate(
      { nis },
      { $set: updateData },
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
        firstName: siswa.firstName,
        lastName: siswa.lastName,
        email: siswa.email,
        alamat: {
          street: siswa.alamat?.street,
          city: siswa.alamat?.city,
          state: siswa.alamat?.state,
          postalCode: siswa.alamat?.postalCode
        },
        photo: siswa.photo,
        coverPhoto: siswa.coverPhoto
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