import mongoose from 'mongoose';

const kelasSchema = new mongoose.Schema({
  namaKelas: {
    type: String,
    required: true
  },
  tingkat: {
    type: String,
    required: true
  },
  tahunAjaran: {
    type: String,
    required: true
  },
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

const Kelas = mongoose.model('Kelas', kelasSchema);

export default Kelas; 