import Guru from '../models/Guru.models.js';
import Siswa from '../models/Siswa.models.js';

// Daftar kelas default
const DEFAULT_KELAS = [
  'X TJKT 1',
  'X TJKT 2',
  'X RPL 1',
  'X RPL 2',
  'XI TJKT 1',
  'XI TJKT 2',
  'XI RPL 1',
  'XI RPL 2',
  'XII TJKT 1',
  'XII TJKT 2',
  'XII RPL 1',
  'XII RPL 2'
];

// Get all kelas from Guru collection or default list
export const getAllKelas = async (req, res) => {
  try {
    // Ambil semua kelas unik dari collection Guru
    const kelasFromGuru = await Guru.distinct('kelas');
    
    // Filter out null/empty values
    const filteredKelas = kelasFromGuru.filter(kelas => kelas);
    
    // Jika tidak ada kelas dari guru, gunakan daftar default
    const kelasList = filteredKelas.length > 0 ? filteredKelas : DEFAULT_KELAS;
    
    res.status(200).json({
      success: true,
      data: kelasList.sort() // Sort kelas ascending
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar kelas',
      error: error.message
    });
  }
};

// Get kelas yang memiliki siswa
export const getKelasWithStudents = async (req, res) => {
  try {
    // Ambil kelas yang memiliki siswa
    const kelasWithStudents = await Siswa.distinct('kelas');
    
    // Jika tidak ada siswa, kembalikan array kosong
    res.status(200).json({
      success: true,
      data: kelasWithStudents.sort() // Sort kelas ascending
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar kelas',
      error: error.message
    });
  }
}; 