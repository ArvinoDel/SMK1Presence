import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  nip: {
    type: String,
    required: true,
    unique: true
  },
  nama: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  jenisKelamin: {
    type: String,
    enum: ['L', 'P']
  },
  noTelp: {
    type: String
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
adminSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin; 