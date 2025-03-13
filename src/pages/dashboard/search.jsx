import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
  Input,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config";

export function Search() {
  const [query, setQuery] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
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

        const response = await fetch(`${API_BASE_URL}${profileEndpoint}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/absensi/kelas/${kodeKelas}`, {
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
          attendance: siswa.status || '-',
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
    <div>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Pencarian Absensi Kelas
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Masukkan kode kelas untuk mencari absensi hari ini
              </Typography>
            </div>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label="Kode Kelas"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        {showTable && (
          <CardBody className="overflow-scroll px-0">
            <table className="w-full min-w-max table-auto text-left">
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
                      className={`px-4 py-2 font-semibold ${
                        siswa.attendance === "HADIR"
                          ? "text-green-400"
                          : siswa.attendance === "IZIN"
                            ? "text-yellow-400"
                            : siswa.attendance === "SAKIT"
                              ? "text-orange-400"
                              : siswa.attendance === "ALFA"
                                ? "text-red-400"
                                : "text-gray-400"
                      }`}
                    >
                      {siswa.attendance}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        )}
      </Card>
    </div>
  );
}

export default Search;
