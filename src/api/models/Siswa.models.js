import mongoose from 'mongoose';

const siswaSchema = new mongoose.Schema({
  nis: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Validasi NIS:
        // 1. Harus berupa string angka
        // 2. Harus tepat 8 digit
        return /^\d{8}$/.test(v);
      },
      message: props => `${props.value} bukan NIS yang valid! NIS harus terdiri dari 8 digit angka.`
    }
  },
  nisn: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Validasi NISN:
        // 1. Harus berupa string angka
        // 2. Harus tepat 10 digit
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} bukan NISN yang valid! NISN harus terdiri dari 10 digit angka.`
    }
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