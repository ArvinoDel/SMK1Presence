import mongoose from 'mongoose';

const guruSchema = new mongoose.Schema({
  nip: {
    type: String,
    required: true,
    unique: true
  },
  nama: {
    type: String,
    required: true
  },
  jenisKelamin: {
    type: String,
    enum: ['L', 'P']
  },
  tanggalLahir: {
    type: Date
  },
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
  noTelp: {
    type: String
  },
  mataPelajaran: {
    type: String
  },
  kelas: {
    type: String,
    default: '-'
  },
  pendidikanTerakhir: {
    type: String,
    enum: ['D3', 'S1', 'S2', 'S3']
  },
  photo: String,
  coverPhoto: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Tambahkan pre-save middleware untuk update timestamps
guruSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Guru = mongoose.model('Guru', guruSchema);

export default Guru; 