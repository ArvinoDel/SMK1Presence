import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { useState, useEffect } from "react";


export function Tables() {
  const [absensiData, setAbsensiData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(localStorage.getItem("token"));

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchAbsensiData = async () => {
      try {
        const response = await fetch('/api/absensi/fetch', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal mengambil data absensi');
        }

        if (result.success) {
          const formattedData = [{
            img: result.data.siswa.photo || 'https://www.gravatar.com/avatar/?d=mp',  // Ambil foto profil siswa jika ada
            nama: result.data.siswa.name, // Nama siswa
            email: result.data.siswa.email, // Email siswa
            tanggal: new Date(result.data.tanggal).toLocaleDateString('id-ID'), // Format tanggal
            jamMasuk: new Date(result.data.jamMasuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), // Format jam
            status: result.data.status, // Status absensi (HADIR, TERLAMBAT, dll.)
            keterangan: result.data.keterangan || "-", // Keterangan absensi
            suratIzin: result.data.suratIzin?.url ? "Ada" : "Tidak Ada" // Cek apakah ada surat izin
          }];

          setTableData(formattedData);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsensiData();
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Riwayat Absensi
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Siswa", "Keterangan", "Status", "Tanggal", "Jam Masuk"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map(({ img, nama, email, tanggal, jamMasuk, status, keterangan, suratIzin }, key) => {
                const className = `py-3 px-5 ${key === tableData.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                return (
                  <tr key={nama}>
                    {/* Kolom Siswa */}
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar src={img} alt={nama} size="sm" variant="rounded" />
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {nama}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {email}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    {/* Kolom Tanggal */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {tanggal}
                      </Typography>
                    </td>

                    {/* Kolom Jam Masuk */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {jamMasuk}
                      </Typography>
                    </td>

                    {/* Kolom Status */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {status}
                      </Typography>
                    </td>

                    {/* Kolom Keterangan */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {keterangan}
                      </Typography>
                    </td>

                    {/* Kolom Surat Izin */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {suratIzin}
                      </Typography>
                    </td>

                    {/* Kolom Edit */}
                    <td className={className}>
                      <Typography as="a" href="#" className="text-xs font-semibold text-blue-gray-600">
                        Edit
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Projects Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["companies", "members", "budget", "completion", ""].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {projectsTableData.map(
                ({ img, name, members, budget, completion }, key) => {
                  const className = `py-3 px-5 ${key === projectsTableData.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={img} alt={name} size="sm" />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${key === 0 ? "" : "-ml-2.5"
                                }`}
                            />
                          </Tooltip>
                        ))}
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {budget}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                          >
                            {completion}%
                          </Typography>
                          <Progress
                            value={completion}
                            variant="gradient"
                            color={completion === 100 ? "green" : "gray"}
                            className="h-1"
                          />
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          <EllipsisVerticalIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
