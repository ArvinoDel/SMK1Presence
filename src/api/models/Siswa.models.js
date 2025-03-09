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
  barcode: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  alamat: {
    street: String,
    city: String,
    state: String,
    postalCode: String
  },
  photo: String,
  coverPhoto: String,
  jenisKelamin: {
    type: String,
    enum: ['L', 'P']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Tambahkan pre-save middleware untuk update timestamps
siswaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Siswa = mongoose.model('Siswa', siswaSchema);

export default Siswa;