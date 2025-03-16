import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const authSchema = new mongoose.Schema({
  nis: { 
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['guru', 'siswa', 'admin'],
    required: true
  },
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role'
  }
}, {
  timestamps: true
});

// Hash password sebelum disimpan
authSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Auth = mongoose.model('Auth', authSchema);

export default Auth; 