import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function Search() {

  const [query, setQuery] = useState("");
  const [showTable, setShowTable] = useState(false);

  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null); // ✅ Tambahkan state untuk role
  const [kelasAbsensi, setKelasAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          navigate("auth/sign-in");
          return;
        }

        const decodedToken = jwtDecode(storedToken);
        setUserRole(decodedToken.role);

        // Fetch based on user role
        let profileEndpoint = '';
        if (decodedToken.role === 'siswa') {
          profileEndpoint = '/api/siswa/profile';
        } else if (decodedToken.role === 'guru') {
          profileEndpoint = '/api/guru/profile';
        } else if (decodedToken.role === 'admin') {
          profileEndpoint = '/api/admin/profile';
        }

        const response = await fetch(`http://localhost:3000${profileEndpoint}`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data);
        } else {
          navigate("/auth/sign-in");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Function to fetch class attendance data
  const fetchKelasAbsensi = async (kodeKelas) => {
    try {
      const response = await fetch(`http://localhost:3000/api/absensi/kelas/${kodeKelas}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.map(siswa => ({
          nis: siswa.nis,
          nisn: siswa.nisn,
          name: siswa.nama,
          class: siswa.kelas,
          classCode: kodeKelas,
          attendance: siswa.status || 'ALFA',
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching class attendance:', error);
      return [];
    }
  };

  // Update search handler
  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery.toUpperCase());
    if (searchQuery.length > 0) {
      const absensiData = await fetchKelasAbsensi(searchQuery);
      setKelasAbsensi(absensiData);
      setShowTable(true);
    } else {
      setKelasAbsensi([]);
      setShowTable(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[200px] my-10 w-full">
        <div className="bg-transparent p-6">
          <h1 className="text-2xl font-bold">
            Selamat Pagi, {userData?.nama || <div className="h-3 bg-gray-200 rounded w-16"></div>} !
          </h1>
          <p className="text-gray-600">Masukkan Kode Kelas Untuk Mencari Absensi Hari Ini.</p>
        </div>

        {/* SEARCH INPUT */}
        <motion.div
          initial={{ width: "80px" }}
          animate={{ width: query.length > 0 ? "350px" : "80px" }}
          whileHover={{ width: "500px" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Masukkan kode kelas..."
            className="w-full px-4 py-2 text-black bg-gray-300 border border-gray-900 rounded-lg focus:outline-none"
            value={query}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
        </motion.div>

        {/* TABLE RESPONSIVE */}
        <AnimatePresence>
          {showTable && kelasAbsensi.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 20, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 w-full max-w-screen-lg bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
            >
              {/* WRAPPER SCROLL UNTUK MOBILE */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-white">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-2 text-left">NIS</th>
                      <th className="px-4 py-2 text-left">NISN</th>
                      <th className="px-4 py-2 text-left">Nama</th>
                      <th className="px-4 py-2 text-left">Kelas</th>
                      <th className="px-4 py-2 text-left">Absensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kelasAbsensi.map((siswa, index) => (
                      <motion.tr
                        key={siswa.nis}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-gray-700"
                      >
                        <td className="px-4 py-2">{siswa.nis}</td>
                        <td className="px-4 py-2">{siswa.nisn}</td>
                        <td className="px-4 py-2">{siswa.name}</td>
                        <td className="px-4 py-2">{siswa.class}</td>
                        <td
                          className={`px-4 py-2 font-semibold ${siswa.attendance === "HADIR"
                              ? "text-green-400"
                              : siswa.attendance === "IZIN"
                                ? "text-yellow-400"
                                : siswa.attendance === "SAKIT"
                                  ? "text-orange-400"
                                  : "text-red-400"
                            }`}
                        >
                          {siswa.attendance}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </>
  );
}

export default Search;
