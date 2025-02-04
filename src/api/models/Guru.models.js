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
    enum: ['L', 'P'],
    required: true
  },
  tanggalLahir: {
    type: Date,
    required: true
  },
  alamat: {
    type: String,
    required: true
  },
  noTelp: {
    type: String,
    required: true
  },
  mataPelajaran: {
    type: String,
    required: true
  },
  pendidikanTerakhir: {
    type: String,
    required: true,
    enum: ['D3', 'S1', 'S2', 'S3']
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

const Guru = mongoose.model('Guru', guruSchema);

export default Guru; 