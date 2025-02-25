import mongoose from 'mongoose';

const kelasAbsensiSchema = new mongoose.Schema({
  tanggal: {
    type: Date,
    required: true
  },
  kelas: {
    type: String,
    required: true
  },
  classCode: {
    type: String,
    required: true
  },
  summary: {
    total: Number,
    hadir: Number,
    terlambat: Number,
    sakit: Number,
    izin: Number,
    alfa: Number
  },
  detailSiswa: [{
    siswa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Siswa'
    },
    status: {
      type: String,
      enum: ['HADIR', 'TERLAMBAT', 'SAKIT', 'IZIN', 'ALFA']
    },
    jamMasuk: Date,
    keterangan: String
  }]
}, {
  timestamps: true
});

// Compound index for tanggal, kelas, and classCode
kelasAbsensiSchema.index({ tanggal: 1, kelas: 1, classCode: 1 }, { unique: true });

const KelasAbsensi = mongoose.model('KelasAbsensi', kelasAbsensiSchema);

export default KelasAbsensi; 