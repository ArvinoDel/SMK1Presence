import cron from 'node-cron';
import { generateKelasAbsensi } from '../controllers/kelasAbsensi.controller.js';
import Siswa from '../models/Siswa.models.js';
import Absensi from '../models/Absensi.models.js';

// Run every minute for realtime summary
export const initCronJobs = async () => {
  // Generate realtime summary every minute
  cron.schedule('* * * * *', async () => {
    console.log('Running realtime attendance summary generation...');
    await generateKelasAbsensi();
  });

  // Save ALFA status at 8 AM WIB (1 AM UTC) every day
  cron.schedule('0 1 * * *', async () => {
    console.log('Running ALFA status recording at 8 AM WIB...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all students
      const allStudents = await Siswa.find();
      console.log(`Processing ${allStudents.length} students for ALFA status...`);

      let alfaCount = 0;
      for (const student of allStudents) {
        // Check if student already has attendance record for today
        const hasAttendance = await Absensi.findOne({
          siswa: student._id,
          tanggal: today
        });

        // If no attendance record exists, create ALFA record
        if (!hasAttendance) {
          const alfaRecord = new Absensi({
            siswa: student._id,
            tanggal: today,
            jamMasuk: new Date(),
            status: 'ALFA',
            keterangan: 'Tidak hadir tanpa keterangan'
          });

          await alfaRecord.save();
          alfaCount++;
        }
      }

      console.log(`ALFA status recording completed. ${alfaCount} ALFA records created.`);
    } catch (error) {
      console.error('Error recording ALFA status:', error);
    }
  });

  // Additional immediate check for ALFA status if after 8 AM
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= 8) {
    console.log('Running immediate ALFA check as it is after 8 AM...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const allStudents = await Siswa.find();
      console.log(`Processing ${allStudents.length} students for immediate ALFA check...`);

      let alfaCount = 0;
      for (const student of allStudents) {
        const hasAttendance = await Absensi.findOne({
          siswa: student._id,
          tanggal: today
        });

        if (!hasAttendance) {
          const alfaRecord = new Absensi({
            siswa: student._id,
            tanggal: today,
            jamMasuk: new Date(),
            status: 'ALFA',
            keterangan: 'Tidak hadir tanpa keterangan'
          });

          await alfaRecord.save();
          alfaCount++;
        }
      }

      console.log(`Immediate ALFA check completed. ${alfaCount} ALFA records created.`);
    } catch (error) {
      console.error('Error during immediate ALFA check:', error);
    }
  }
}; 