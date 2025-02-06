import React, { useState, useEffect } from "react";

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
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
      </div>

      {/* Glowing Effect */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[250px] h-[250px] bg-blue-500 opacity-20 blur-[120px]"></div>
    </div>
  );
}

export default DigitalClock;
