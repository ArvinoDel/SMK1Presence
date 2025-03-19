import mongoose from 'mongoose';

const absensiSchema = new mongoose.Schema({
  siswa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Siswa',
    required: true
  },
  tanggal: {
    type: Date,
    required: true
  },
  jamMasuk: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['HADIR', 'TERLAMBAT', 'SAKIT', 'IZIN', 'ALFA'],
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  keterangan: {
    type: String,
    default: ''
  },
  suratIzin: {
    url: String,
    publicId: String
  }
}, {
  timestamps: true
});

// Mencegah duplikasi absensi di hari yang sama
absensiSchema.index({ siswa: 1, tanggal: 1 }, { unique: true });

const Absensi = mongoose.model('Absensi', absensiSchema);

export default Absensi; 