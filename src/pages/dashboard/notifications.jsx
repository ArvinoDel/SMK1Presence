import React, { createContext, useState, useContext, useEffect } from 'react';
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

export function Notifications() {
  const [showAlerts, setShowAlerts] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const alerts = ["gray", "green", "orange", "red"];

  const [query, setQuery] = useState("");
  const [showTable, setShowTable] = useState(false);

  // Data Dummy Siswa dengan Kode Kelas
  const students = [
    { nis: "220001", nisn: "0056789012", name: "Andi Pratama", class: "XII RPL 2", classCode: "RPL2SMKN1", attendance: "Hadir" },
    { nis: "220002", nisn: "0056789013", name: "Budi Santoso", class: "XII TOI 2", classCode: "TOI2SMKN1", attendance: "Izin" },
    { nis: "220003", nisn: "0056789014", name: "Citra Lestari", class: "XII DPIB 2", classCode: "DPIB2SMKN1", attendance: "Alfa" },
    { nis: "220004", nisn: "0056789015", name: "Dewi Ayu", class: "XII TJKT 2", classCode: "TJKT2SMKN1", attendance: "Hadir" },
    { nis: "220005", nisn: "0056789016", name: "Eka Saputra", class: "XII RPL 2", classCode: "RPL2SMKN1", attendance: "Hadir" },
  ];

  return (
    <>

      <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
        <Card>
          <CardHeader
            color="transparent"
            floated={false}
            shadow={false}
            className="m-0 p-4"
          >
            <Typography variant="h5" color="blue-gray">
              Alerts
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-4">
            {alerts.map((color) => (
              <Alert
                key={color}
                open={showAlerts[color]}
                color={color}
                onClose={() => setShowAlerts((current) => ({ ...current, [color]: false }))}
              >
                A simple {color} alert with an <a href="#">example link</a>. Give
                it a click if you like.
              </Alert>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            color="transparent"
            floated={false}
            shadow={false}
            className="m-0 p-4"
          >
            <Typography variant="h5" color="blue-gray">
              Alerts with Icon
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-4">
            {alerts.map((color) => (
              <Alert
                key={color}
                open={showAlertsWithIcon[color]}
                color={color}
                icon={
                  <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
                }
                onClose={() => setShowAlertsWithIcon((current) => ({
                  ...current,
                  [color]: false,
                }))}
              >
                A simple {color} alert with an <a href="#">example link</a>. Give
                it a click if you like.
              </Alert>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* SEARCH INPUT */}
        <motion.div
          initial={{ width: "80px" }}
          animate={{ width: query.length > 0 ? "350px" : "80px" }} // Tetap besar saat ada input
          whileHover={{ width: "500px" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Masukkan kode kelas..."
            className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value.toUpperCase());
              setShowTable(e.target.value.length > 0);
            }}
          />
        </motion.div>

        {/* TABLE MUNCUL DI BAWAH SEARCH */}
        <AnimatePresence>
          {showTable && students.some((siswa) => siswa.classCode.includes(query)) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 20, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 w-[500px] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
            >
              <table className="w-full text-white">
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
                  {students
                    .filter((siswa) => siswa.classCode.includes(query))
                    .map((siswa, index) => (
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
                          className={`px-4 py-2 font-semibold ${siswa.attendance === "Hadir"
                              ? "text-green-400"
                              : siswa.attendance === "Izin"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                        >
                          {siswa.attendance}
                        </td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Notifications;
