import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css"; // Tambahkan ini
import { API_BASE_URL } from "@/config";

function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle barcode scan
  const handleScan = async (scanData) => {
    try {
      console.log('Raw scan data:', scanData); // Debugging

      const response = await fetch(`${API_BASE_URL}/api/absensi/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nisn: scanData.toString().trim() // Pastikan data dalam bentuk string dan bersih
        })
      });

      const data = await response.json();
      console.log('Response:', data); // Debugging

      if (data.success) {
        setScanResult(data.data);

        Swal.fire({
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <h2 style="margin-bottom: 10px; font-size: 22px; color: #333;">
                <strong>Halo, Selamat Pagi!</strong>
              </h2>
              <img src="${data.data.foto || '../img/team-1.jpeg'}" 
                   alt="Foto Siswa" 
                   style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;">
              <strong style="font-size: 18px; color: #2c3e50;">${data.data.nama}</strong>
              <p style="margin: 5px 0; font-size: 16px; color: #444;">Kelas: <b>${data.data.kelas}</b></p>
              <p style="margin: 5px 0; font-size: 16px; color: #444;">Status: <b>${data.data.status}</b></p>
              <p style="margin-top: 10px; font-size: 15px; color: #555;">${data.data.keterangan}</p>
            </div>
          `,
          background: "#f9f9f9",
          padding: "20px",
          timer: 6000,
          showConfirmButton: false,
        });

        // Play success sound
        new Audio('/sounds/success.mp3').play();
      } else {
        setError(data.message);
        Swal.fire({
          title: "Anda Sudah Absen!",
          text: data.message,
          icon: "error",
          timer: 3000, // Timer 2 detik (2000ms)
          showConfirmButton: false,
        });
        // Play error sound
        new Audio('/sounds/error.mp3').play();
      }
    } catch (err) {
      console.error('Error:', err); // Debugging
      setError('Gagal memproses absensi');
      Swal.fire({
        title: "Error!",
        text: "Gagal memproses absensi",
        icon: "error",
        timer: 4000,
        showConfirmButton: false,
      });
      // Play error sound
      new Audio('/sounds/error.mp3').play();
    }

    // Clear messages after 3 seconds
    setTimeout(() => {
      setScanResult(null);
      setError(null);
    }, 3000);
  };

  // Listen for barcode scanner input
  useEffect(() => {
    let scannedData = '';
    let lastScanTime = 0;

    const handleKeyPress = (e) => {
      const currentTime = new Date().getTime();

      // Reset jika jeda terlalu lama
      if (currentTime - lastScanTime > 100) {
        scannedData = '';
      }

      lastScanTime = currentTime;

      // Kumpulkan data scan
      if (e.key !== 'Enter') {
        scannedData += e.key;
      } else if (scannedData) {
        console.log('Scanned data before processing:', scannedData); // Debugging
        handleScan(scannedData);
        scannedData = '';
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  // Format Time (HH:MM:SS)
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Format Date (Day, Month DD, YYYY)
  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500 via-blue-gray-100 to-gray-500 opacity-90"></div>
          <div className="absolute inset-0 bg-noise opacity-10"></div>
        </div>

        {/* Digital Clock Card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
          <h2 className="text-lg font-semibold text-gray-900 tracking-widest">
            Waktu Saat Ini
          </h2>
          <div className="text-7xl md:text-8xl font-bold mt-3 mb-5 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-glow">
            {formattedTime}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 tracking-widest">
            Tanggal Hari ini
          </h2>
          <div className="text-xl font-bold font-sans md:text-2xl mt-3 text-gray-900">
            {formattedDate}
          </div>

          {/* Scan Result Display */}
          {scanResult && (
            <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg">
              <p className="font-bold">{scanResult.nama}</p>
              <p>Kelas: {scanResult.kelas}</p>
              <p>Status: {scanResult.status}</p>
              <p>{scanResult.keterangan}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Scanner Instructions */}
          <div className="mt-6 text-gray-600">
            Silakan scan kartu ID untuk melakukan absensi
          </div>
        </div>

        {/* Glowing Effect */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[250px] h-[250px] bg-blue-500 opacity-20 blur-[120px]"></div>
      </div>
    </>
  );
}

export default DigitalClock;
