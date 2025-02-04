import mongoose from 'mongoose';

const siswaSchema = new mongoose.Schema({
  nis: {
    type: String,
    required: true,
    unique: true
  },
  nisn: {
    type: String,
    required: true,
    unique: true
  },
  nama: {
    type: String,
    required: true
  },
  kelas: {
    type: String,
    required: true
  },
  qrCode: {
    type: String  // Menyimpan string base64 QR code
  },
  // Field opsional
  jenisKelamin: {
    type: String,
    enum: ['L', 'P'],
    default: ''
  },
  tanggalLahir: {
    type: Date
  },
  alamat: {
    type: String
  },
  noTelp: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Tambahkan pre-save middleware untuk update timestamps
siswaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Siswa = mongoose.model('Siswa', siswaSchema);

export default Siswa;