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
  alamat: {
    type: String
  },
  noTelp: {
    type: String
  },
  mataPelajaran: {
    type: String
  },
  pendidikanTerakhir: {
    type: String,
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