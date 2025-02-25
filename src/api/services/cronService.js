import cron from 'node-cron';
import { generateKelasAbsensi } from '../controllers/kelasAbsensi.controller.js';

// Run every minute
export const initCronJobs = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Running realtime attendance summary generation...');
    await generateKelasAbsensi();
  });
}; 